import proxyquire from 'proxyquire';
import stripAdditionalWhitespaces from './../../lib/pg/stripAdditionalWhitespaces';

describe("PGModel", function() {
    beforeEach(function() {
        this.none = sinon.spy();
        this.many = sinon.spy();
        this.oneOrNone = sinon.spy();

        var PGModel = proxyquire('./../../lib/pg/PGModel', {
            './../db': {
                default: () => ({
                    none: this.none,
                    many: this.many,
                    oneOrNone: this.oneOrNone
                })
            }
        }).default;

        this.model = new PGModel({
            tableName: "users",
            columns: [
                {name: "id", type: "serial"},
                {name: "username", type: "varchar(128)"},
                {name: "password", type: "varchar(128)"},
                {name: "data", type: "jsonb", null: true},
                {name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP"},
                {name: "last_login", type: "timestamp"}
            ]
        });
    });

    describe("findOne()", function() {
        beforeEach(async function() {
            await this.model.findOne({column: "username", value: "myUser"});
        });

        it("finds records", function() {
            expect(this.oneOrNone).to.have.been.calledWith("select * from users where username = $1", "myUser");
        });
    });

    describe("findOne() between", function() {
        beforeEach(async function() {
            await this.model.findOne({column: "username", value: {between: {start: "a", end: "Z"}}});
        });

        it("finds records", function() {
            expect(this.oneOrNone).to.have.been.calledWith(`select * from users where username between $1 and $2`, ["a", "Z"]);
        });
    });

    describe("findAll()", function() {
        describe("with only column and value", function() {
            beforeEach(async function() {
                await this.model.findAll({column: "username", value: "myUser"});
            });

            it("finds records", function() {
                expect(this.many).to.have.been.calledWith("select * from users where username = $1", "myUser");
            });
        });

        describe("with only column, value and limit", function() {
            beforeEach(async function() {
                await this.model.findAll({column: "username", value: "myUser", limit: 10});
            });

            it("finds records", function() {
                expect(this.many).to.have.been.calledWith("select * from users where username = $1 limit 10", "myUser");
            });
        });

        describe("with only column, value and orderBy", function() {
            beforeEach(async function() {
                await this.model.findAll({column: "username", value: "myUser", orderBy: "username desc"});
            });

            it("finds records", function() {
                expect(this.many).to.have.been.calledWith("select * from users where username = $1 order by username desc", "myUser");
            });
        });

        describe("with only column, value, orderBy and limit", function() {
            beforeEach(async function() {
                await this.model.findAll({column: "username", value: "myUser", orderBy: "username desc", limit: 10});
            });

            it("finds records", function() {
                expect(this.many).to.have.been.calledWith("select * from users where username = $1 order by username desc limit 10", "myUser");
            });
        });
    });

    describe("findAll() without parameters", function() {
        beforeEach(async function() {
            await this.model.findAll();
        });

        it("finds records", function() {
            expect(this.many).to.have.been.calledWith("select * from users");
        });
    });

    describe("findAll() between", function() {
        beforeEach(async function() {
            await this.model.findAll({column: "username", value: {between: {start: "a", end: "Z"}}});
        });

        it("finds records", function() {
            expect(this.many).to.have.been.calledWith(`select * from users where username between $1 and $2`, ["a", "Z"]);
        });
    });

    describe("create()", function() {
        beforeEach(async function() {
            await this.model.create({username: "test", password: "test", data: {modules: {}}});
        });

        it("creates item", function() {
            expect(this.none).to.have.been.calledWith("insert into users (username,password,data) values ($/username/,$/password/,$/data/)");
        });
    });

    describe("update()", function() {
        beforeEach(async function() {
            await this.model.update({
                column: "last_login",
                value: "current_timestamp",
                where: {column: "username", value: "myUser"}
            });
        });

        it("finds records", function() {
            expect(this.oneOrNone).to.have.been.calledWith("update users set last_login = current_timestamp where username = $1", "myUser");
        });
    });

    describe("remove()", function() {
        beforeEach(async function() {
            await this.model.remove({column: "username", value: "myUser"});
        });

        it("creates item", function() {
            expect(this.none).to.have.been.calledWith("delete from users where username = $1", "myUser");
        });
    });

    describe("__recreate", function() {
        beforeEach(async function() {
            await this.model.__recreate();
        });

        it("drops table if exists", function() {
            expect(this.none).to.have.been.calledWith("drop table if exists users");
        });

        it("recreates the table", function() {
            expect(this.none).to.have.been.calledWith(stripAdditionalWhitespaces(`
                create table users (
                    id serial not null,
                    username varchar(128) not null,
                    password varchar(128) not null,
                    data jsonb,
                    created_at timestamp not null default CURRENT_TIMESTAMP,
                    last_login timestamp not null
                )
            `));
        });
    });
});