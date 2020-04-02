export default interface Drugs {
  term: string;
  concept: {

    conceptId: string;
    fsn: {
      term: string
    };
    semanticTag: string;
  }
}
