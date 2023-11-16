export const imageUrlRegex =
  /^(http(s?):)([/|.|\w|\s|-])*\.(?:png|gif|webp|jpeg|jpg)$/;

export const youtubeLinkRegex =
  /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w-_]+)/gim;

export const usernameRegex = /^[\w-_]*$/;
