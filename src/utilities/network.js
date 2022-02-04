import _ from "lodash";

export function URIWithParams(url, resource, params) {
  let uri = new URL(url);
  if (resource) uri = new URL(resource, uri);

  uri.search = new URLSearchParams(params).toString();

  return uri;
}

export const sugokuBoardURI = _.curry(URIWithParams)(
  "https://sugoku.herokuapp.com",
  "board"
);
