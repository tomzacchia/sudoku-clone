## Requirements Legend

- M = must haves
- S = should have
- C = could have
- W = won't have

- dipsplay tip at the start of the game

  - M: click on 'x' to close tip modal
  - M: persist user state in localStorage to hide tip on refresh

- user can select cell by clicking

  - M: in UI: highlight all columns, rows and subgrids that contain user selected cell
    - M: 1) if cell is empty, only show highlights as listed above
    - C: 2) if cell contains a number highlight all cells that contain the same number

- user enters a number by keyboard

  - M: if number is valid - highlight as default
  - S: if number is invalid - highlight all matching numbers in all columns, rows and subgrids that contain the user's number
    - display incorrect input in red font, red background for matching colors

- S: user notes

  - entering number adds a node to the notes subgrid
    - numbers always go in the same place, 1 --> coord (0,0)
    - entering an existing number removes it from UI
    - entering a guess where notes exists erases all notes

- C: arrow keys navigation

- M: on completion a message is displayed

- M: button that displays a menu to select a new game or to restart

  - S: spinner displays while game is being rendered

- M: game header displays current difficulty

- S: restart button

- S: erase button
