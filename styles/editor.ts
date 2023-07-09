import css from "styled-jsx/css";

export default css.global`
  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;
  }

  ul[data-type="taskList"] li {
    display: flex;
    align-items: center;
  }

  ul[data-type="taskList"] li > label {
    flex: 0 0 auto;
    margin-right: 0.5rem;
    user-select: none;
  }

  ul[data-type="taskList"] li > div {
    flex: 1 1 auto;
  }

  ul[data-type="taskList"] li > div > p {
    margin: 0;
  }

  ul[data-type="taskList"] input[type="checkbox"] {
    cursor: pointer;
  }
`;
