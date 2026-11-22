export const CHARS = "!<>-_\\/[]{}—=+*^?#________";
export const FRAME_MS = 1000 / 60;
export const SPEED = 2;
export const CHAR_HOLD_MS = FRAME_MS / SPEED / 0.28;

export const toMs = (frames: number) => (frames * FRAME_MS) / SPEED;
export const randMs = (maxFrames: number) => toMs(Math.floor(Math.random() * maxFrames));

export const escapeHtml = (s: string) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[c] || c,
  );

export const renderChar = (c: string) => (c === "\n" ? "<br>" : escapeHtml(c));

export const renderCell = (measure: string, visualHtml: string, extraClass = "") => {
  const cls = extraClass
    ? `scramble-cell__visual ${extraClass}`
    : "scramble-cell__visual";
  return `<span class="scramble-cell" data-scramble-measure="${escapeHtml(measure || " ")}"><span class="${cls}">${visualHtml}</span></span>`;
};

export const createBuffer = () => {
  let html = "";
  let inWord = false;
  return {
    appendText(t: string) {
      if (inWord) {
        html += "</span>";
        inWord = false;
      }
      html += t;
    },
    appendCell(c: string) {
      if (!inWord) {
        html += '<span class="scramble-word">';
        inWord = true;
      }
      html += c;
    },
    toString() {
      if (inWord) html += "</span>";
      return html;
    },
  };
};
