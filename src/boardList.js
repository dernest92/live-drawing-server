class BoardList {
  constructor() {
    this.boards = [];
  }
  addBoard(board) {
    this.boards = [...this.boards, board];
  }
  getDirectory() {
    return this.boards.map(b => {
      return {
        name: b.name,
        slug: b.slug
      };
    });
  }
}

module.exports = BoardList;
