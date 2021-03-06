import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { FolderData } from '../components/FolderPage/services/types';
import { BACKEND_URL } from '../env';

// TODO: test with cookies https://mswjs.io/docs/recipes/cookies
const SESSION_KEY = 'is-authenticated';
const session = {
    setAuthenticated: () => {
        sessionStorage.setItem(SESSION_KEY, 'true');
    },
    getIsAuthenticated: () => 'true' === sessionStorage.getItem(SESSION_KEY),
    setNotAuthenticated: () => {
        sessionStorage.removeItem(SESSION_KEY);
    },
};

const SESSION_ENDPOINT_URL = `${BACKEND_URL}/session`;
const FOLDER_ENDPOINT_URL = `${BACKEND_URL}/folder/*`;

export const TEST_USERNAME = 'test';
export const TEST_PASSWORD = 'test123';

export const handlers = [
    rest.post<{ username: string; password: string }>(
        SESSION_ENDPOINT_URL,
        (req, res, ctx) => {
            const { username, password } = req.body;

            if (username === TEST_USERNAME && password === TEST_PASSWORD) {
                session.setAuthenticated();
                return res(ctx.status(200));
            }

            return res(ctx.status(401));
        }
    ),
    rest.get(SESSION_ENDPOINT_URL, (req, res, ctx) => {
        return res(ctx.json(session.getIsAuthenticated()));
    }),
    rest.delete(SESSION_ENDPOINT_URL, (req, res, ctx) => {
        session.setNotAuthenticated();
        return res(ctx.status(200));
    }),
    rest.get(FOLDER_ENDPOINT_URL, (req, res, ctx) => {
        if (!session.getIsAuthenticated()) return res(ctx.status(401));

        const path = req.params['0'].toString();

        const folderData = folderDataMap[path];

        if (!folderData) return res(ctx.status(404));

        return res(ctx.json(folderData));
    }),
];

const folderDataMap: Record<string, FolderData> = {
    '': {
        name: 'root',
        items: [
            {
                name: 'nested',
                type: 'dir',
                sizeKb: 0,
            },
            {
                name: 'small.rs',
                type: 'file',
                sizeKb: 0.5,
            },
            {
                name: 'medium.rs',
                type: 'file',
                sizeKb: 320,
            },
            {
                name: 'large.rs',
                type: 'file',
                sizeKb: 3200,
            },
        ],
    },
    nested: {
        name: 'nested',
        items: [
            {
                name: 'fileInNestedFolder.rs',
                type: 'file',
                sizeKb: 1,
            },
        ],
    },
};

const server = setupServer(...handlers);

export default server;
