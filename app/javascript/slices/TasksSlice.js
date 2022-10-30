import { propEq } from 'ramda';
import { createSlice } from '@reduxjs/toolkit';
import TasksRepository from 'repositories/TasksRepository';
import { STATES } from 'presenters/TaskPresenter';
import { useDispatch } from 'react-redux';
import { changeColumn } from '@asseinfo/react-kanban';

const initialState = {
  board: {
    columns: STATES.map((column) => ({
      id: column.key,
      title: column.value,
      cards: [],
      meta: {},
    })),
  },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    loadColumnSuccess(state, { payload }) {
      const { items, meta, columnId } = payload;
      const column = state.board.columns.find(propEq('id', columnId));

      state.board = changeColumn(state.board, column, {
        cards: items,
        meta,
      });

      return state;
    },

    loadColumnMoreSuccess(state, { payload }) {
      const { items, meta, columnId } = payload;
      const column = state.board.columns.find(propEq('id', columnId));

      state.board = changeColumn(state.board, column, {
        cards: column.cards.concat(items),
        meta,
      });

      return state;
    },
  },
});

const { loadColumnSuccess, loadColumnMoreSuccess } = tasksSlice.actions;

export default tasksSlice.reducer;

export const useTasksActions = () => {
  const dispatch = useDispatch();

  const loadColumn = (state, page = 1, perPage = 10) => {
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage,
    }).then(({ data }) => {
      dispatch(loadColumnSuccess({ ...data, columnId: state }));
    });
  };

  const loadColumnMore = (state, page = 1, perPage = 10) => {
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage,
    }).then(({ data }) => {
      dispatch(loadColumnMoreSuccess({ ...data, columnId: state }));
    });
  };

  const loadBoard = () => STATES.map(({ key }) => loadColumn(key));

  const cardDragEnd = (task, source, destination) => {
    const transition = task.transitions.find(({ to }) => destination.toColumnId === to);
    if (!transition) {
      return null;
    }

    return TasksRepository.update(task.id, {
      task: { stateEvent: transition.event },
    })
      .then(() => {
        loadColumnInitial(destination.toColumnId);
        loadColumnInitial(source.fromColumnId);
      })
      .catch((error) => {
        alert(`Move failed! ${error.message}`);
      });
  };

  const taskCreate = (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    return TasksRepository.create(attributes).then(({ data: { task } }) => {
      loadColumnInitial(task.state);
    });
  };

  const taskLoad = (id) => TasksRepository.show(id).then(({ data: { task } }) => task);

  const taskUpdate = (task) => {
    const attributes = TaskForm.attributesToSubmit(task);

    return TasksRepository.update(task.id, attributes).then(() => {
      loadColumnInitial(task.state);
      handleClose();
    });
  };

  const taskDestroy = (task) =>
    TasksRepository.destroy(task.id).then(() => {
      loadColumnInitial(task.state);
      handleClose();
    });

  return {
    loadBoard,
    loadColumn,
    loadColumnMore,
    cardDragEnd,
    taskCreate,
    taskLoad,
    taskUpdate,
    taskDestroy,
  };
};
