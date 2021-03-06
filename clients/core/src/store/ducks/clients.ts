import { get, keyBy, keys, values } from 'lodash';
import { AnyAction, Store } from 'redux';
import SeamlessImmutable from 'seamless-immutable';
import { FlexObject } from '../../helpers/utils';

/** The reducer name */
export const reducerName = 'clients';

/** Interface for client object as received from clientServices */
export interface Client {
    type: 'Client';
    dateCreated: number;
    serverVersion: number;
    clientApplicationVersion: number;
    clientDatabaseVersion: number;
    baseEntityId: string;
    identifiers: { [key: string]: string | null };
    addresses: FlexObject[];
    attributes: FlexObject;
    firstName: string;
    lastName: string;
    birthdate: number;
    middleName?: string;
    birthdateApprox: boolean;
    deathdateApprox: boolean;
    gender?: string;
    relationships: {
        [key: string]: string[];
    };
    _id: string;
    _rev: string;
}

// actions

/** CLIENTS_FETCHED action type */
export const CLIENTS_FETCHED = 'opensrp/reducer/clients/CLIENTS_FETCHED';
/** REMOVE_CLIENTS action type */
export const REMOVE_CLIENTS = 'opensrp/reducer/clients/REMOVE_CLIENTS';

/** interface for authorize action */
export interface FetchClientsAction extends AnyAction {
    clientsById: { [key: string]: Client };
    type: typeof CLIENTS_FETCHED;
}

/** Interface for removeClientsAction */
interface RemoveClientsAction extends AnyAction {
    clientsById: {};
    type: typeof REMOVE_CLIENTS;
}

/** Create type for clients reducer actions */
export type ClientsActionTypes = FetchClientsAction | RemoveClientsAction | AnyAction;

// action Creators

/** Fetch clients action creator
 * @param {Client []} clientsList - clients array to add to store
 * @return {FetchClientsAction} - an action to add clients to redux store
 */
export const fetchClients = (clientsList: Client[] = []): FetchClientsAction => ({
    clientsById: keyBy(clientsList, (client: Client) => client.baseEntityId),
    type: CLIENTS_FETCHED,
});

/** Fetch clients action creator
 * @param {Client []} clientsList - clients array to add to store
 * @return {FetchClientsAction} - an action to add clients to redux store
 */
export const removeClients = (clientsList: Client[] = []): RemoveClientsAction => ({
    clientsById: keyBy(clientsList, (client: Client) => client.baseEntityId),
    type: REMOVE_CLIENTS,
});

// actions

/** removeClientsAction action */
export const removeClientsAction = {
    clientsById: {},
    type: REMOVE_CLIENTS,
};

// The reducer

/** interface for clients state in redux store */
interface ClientState {
    clientsById: { [key: string]: Client };
}

/** Create an immutable clients state */
export type ImmutableClientsState = ClientState & SeamlessImmutable.ImmutableObject<ClientState>;

/** initial clients-state state */
const initialState: ImmutableClientsState = SeamlessImmutable({
    clientsById: {},
});

/** the clients reducer function */
export default function reducer(
    state: ImmutableClientsState = initialState,
    action: ClientsActionTypes,
): ImmutableClientsState {
    switch (action.type) {
        case CLIENTS_FETCHED:
            return SeamlessImmutable({
                ...state,
                clientsById: { ...state.clientsById, ...action.clientsById },
            });
        case REMOVE_CLIENTS:
            return SeamlessImmutable({
                ...state,
                clientsById: action.clientsById,
            });
        default:
            return state;
    }
}

// Selectors

/** returns all clients in the store as values whose keys are their respective ids
 * @param {Partial<Store>} state - the redux store
 * @return { { [key: string] : Client} } - clients object as values, respective ids as keys
 */
export function getClientsById(state: Partial<Store>): { [key: string]: Client } {
    return (state as any)[reducerName].clientsById;
}

/** gets clients as an array of clients objects
 * @param {Partial<Store>} state - the redux store
 * @return {Client[]} - an array of clients objs
 */
export function getClientsArray(state: Partial<Store>): Client[] {
    return values(getClientsById(state));
}

/** get a specific client by their id
 * @param {Partial<Store>} state - the redux store
 * @return {Client | null} a client obj if the id is found else null
 */
export function getClientById(state: Partial<Store>, id: string): Client | null {
    return get(getClientsById(state), id) || null;
}
