export const BOARD_LENGTH = 9;

export const DUMMY_BOARD = [
  [5, 3, "", 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, "", 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, "", 7, 9, 1],
  [7, "", 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

export const difficulties = ["easy", "medium", "hard"];

export const localStorageKeys = {
  untouchedBoard: "untouchedBoard",
  userBoard: "userBoard",
  difficulty: "difficulty",
  showGametip: "showGametip",
};
