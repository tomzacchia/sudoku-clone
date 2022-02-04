import { useState, useCallback } from "react";
import { sugokuBoardURI } from "utilities/network";

/**
 *
 * @param {*} params | {difficulty: "easy" || "medium || "hard"}
 */
export async function getBoardByDifficulty(params) {
  const url = sugokuBoardURI(params);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Request was unsuccessful");
  }

  const data = await response.json();

  return data.board;
}

export function useGetBoardByDifficulty() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [board, setBoard] = useState(null);

  async function execute(options = {}) {
    setIsLoading(true);
    try {
      setError(null);
      const board = await getBoardByDifficulty(options);
      setBoard(board);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  }

  return {
    isLoading,
    error,
    board,
    execute: useCallback(execute, []),
  };
}
