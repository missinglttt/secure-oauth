import mongoose from 'mongoose';
import { EventEmitter } from 'events';

export class Connection {
    database: string;
    host: string = "localhost";
    port: number = 27017;
    username: string;
    password: string;
    authentication: boolean = false;
    cache: boolean = false;
    repl: string;
    opts: mongoose.ConnectionOptions;
}

export interface IDatabaseStore extends EventEmitter {
    connect(connection: Connection): Promise<typeof mongoose>;
    getInfo(): Connection;
    isConnected(): boolean;
    disconnect(): void;
}

export class DatabaseStore extends EventEmitter implements IDatabaseStore {
    private _connectionInfo: Connection;
    private _conn: typeof mongoose;
    private _isConnected: boolean;
    private _url: string;
    private _connectionUpdateTime: number = -1;
    private _downTime: number = 0;

    constructor() {
        super();
    }

    async connect(connection: Connection) {
        if (!connection.database) {
            return Promise.reject(new Error("unknown_database"));
        }

        this._url = "mongodb://";
        if (connection.authentication) {
            if (!connection.username || !connection.password) {
                return Promise.reject(new Error("username_or_password_cannot_be_empty"));
            }

            this._url += connection.username +
                ":" + connection.password +
                "@" + connection.host +
                ":" + connection.port +
                "/" + connection.database;
        } else {
            this._url += connection.host +
                ":" + connection.port +
                "/" + connection.database;
        }

        if (connection.repl) {
            this._url += "?replicaSet=" + connection.repl;
        }

        this._connectionInfo = connection;
        this._connectionInfo.password = "*";
        this._conn = await mongoose.connect(this._url, connection.opts);
        return this.listenOnConnectionEvent(this._conn);
    }

    disconnect() {
        return mongoose.disconnect();
    }

    isConnected() {
        return this._isConnected
    }

    getInfo() {
        return this._connectionInfo;
    }

    private listenOnConnectionEvent(conn: typeof mongoose) {
        conn.connection.on("connecting", this.onConnecting.bind(this));
        conn.connection.on("connected", this.onConnected.bind(this));
        conn.connection.on("error", this.onError.bind(this));
        conn.connection.on("disconnected", this.onDisconnect.bind(this));
        return conn;
    }

    private onConnecting() {
        this._isConnected = false;
    }

    private onConnected() {
        this._isConnected = true;
        if (this._connectionUpdateTime > -1) {
            this._downTime = Date.now() - this._connectionUpdateTime;
        }

        this._connectionUpdateTime = Date.now();
        this.emit("connected", this._connectionInfo, this._downTime);
    }

    private onError(err: mongoose.Error) {
        if (this._conn.connection.readyState === 1) {
            this._isConnected = true;
        } else {
            this._isConnected = false;
            this._connectionUpdateTime = Date.now();
        }

        this.emit("error", err, this._connectionInfo);
    }

    private onDisconnect() {
        this._isConnected = false;
        this._connectionUpdateTime = Date.now();
        this.emit("disconnected", this._conn, this._connectionUpdateTime);
    }
}