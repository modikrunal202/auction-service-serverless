import { createLogger, transports, format } from 'winston';
const { printf, combine } = format;


const logger = createLogger({
    level: 'info',
    format: formatErrorLog(),
    exitOnError: false,
    transports: true ? [
        new transports.Console({
            format: combine(
                format.splat(),
                format.errors({ stack: true }),
                formatLog(),
            ),
        }),
    ] : [new transports.File({ filename: 'logs/error.log', level: 'error' }), new transports.Console()],
})

function formatErrorLog() {
    return combine(
        format.splat(),
        format.errors({ stack: true }),
        formatLog(),
    );
}

function formatLog() {
    return printf((info): string => {
        const {
            message: logMessage,
            level: logLevel,
            ...metadata
        } = info;

        let message: any = '';
        let metadataInfo: any = '';

        if (typeof logMessage === 'string') {
            message = logMessage;
        } else if (
            typeof logMessage === 'object' &&
            Object.keys(logMessage).length > 0
        ) {
            message = JSON.stringify(logMessage);
        }

        if (typeof metadata === 'string') {
            metadataInfo = metadata;
        } else if (
            typeof metadata === 'object' &&
            Object.keys(metadata).length > 0
        ) {
            try {
                metadataInfo = JSON.stringify(metadata);
            } catch (error) {
                // do nothing
            }
        }
        return `${logLevel} ${process.pid} ${message} ${metadataInfo}`;
    });
}

export const loggerStream: any = {
    write: (message: any) => {
        logger.info(message);
    },
};

export default logger;
