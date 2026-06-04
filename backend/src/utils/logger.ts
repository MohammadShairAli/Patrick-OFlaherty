type LogFields = Record<string, string | number | boolean | undefined>;

function write(level: "info" | "warn" | "error", message: string, fields: LogFields) {
  console[level](
    JSON.stringify({
      level,
      message,
      ...fields,
    }),
  );
}

export const logger = {
  error(message: string, fields: LogFields = {}) {
    write("error", message, fields);
  },
  info(message: string, fields: LogFields = {}) {
    write("info", message, fields);
  },
  warn(message: string, fields: LogFields = {}) {
    write("warn", message, fields);
  },
};
