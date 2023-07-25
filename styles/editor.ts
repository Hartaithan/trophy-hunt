import css from "styled-jsx/css";

export default css.global`
  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;
  }

  ul[data-type="taskList"] li {
    display: flex;
  }

  ul[data-type="taskList"] li > label {
    flex: 0 0 auto;
    margin-right: 0.5rem;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  ul[data-type="taskList"] li > div {
    flex: 1 1 auto;
  }

  ul[data-type="taskList"] li > div > p {
    margin: 0;
  }

  ul[data-type="taskList"] p {
    margin: 0;
  }

  ul[data-type="taskList"] input[type="checkbox"] {
    cursor: pointer;
  }

  div[data-youtube-video] iframe {
    border: none;
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
  }
`;
