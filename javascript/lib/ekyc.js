/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class User extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const users = [
            {
                // id= verified Id number e.g. Drivers license
                id: '989854853321',
                fullname: 'John Doe',
                birthMonth: 'June',
                userStatus: 'NOT APPROVED',
            },
            {
                // id= verified Id number e.g. Drivers license
                id: '9865123452321',
                fullname: 'Jane Doe',
                birthMonth: 'April',
                userStatus: 'PENDING APPROVAL',
            },
            {
                // id= verified Id number e.g. Drivers license
                id: '9898523456321',
                fullname: 'James Dan',
                birthMonth: 'March',
                userStatus: 'NOT APPROVED',
            },
            {
                // id= verified Id number e.g. Drivers license
                id: '9823235663321',
                fullname: 'James Doe',
                birthMonth: 'July',
                userStatus: 'PENDING APPROVAL',
            },
            {
                // id= verified Id number e.g. Drivers license
                id: '9843564853321',
                fullname: 'April Dean',
                birthMonth: 'January',
                userStatus: 'REJECTED',

            },

        ];

        for (let i = 0; i < users.length; i++) {
            users[i].docType = 'user';
            await ctx.stub.putState('user' + i, Buffer.from(JSON.stringify(users[i])));
            console.info('Added <--> ', users[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryuser(ctx, userNumber) {
        const userAsBytes = await ctx.stub.getState(userNumber); // get the user from chaincode state
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${userNumber} does not exist`);
        }
        console.log(userAsBytes.toString());
        return userAsBytes.toString();
    }

    async createuser(ctx, userNumber, id, fullname, birthMonth, userStatus) {
        console.info('============= START : Create user ===========');

        const user = {
            id,
            docType: 'user',
            fullname,
            birthMonth,
            userStatus,
        };

        await ctx.stub.putState(userNumber, Buffer.from(JSON.stringify(user)));
        console.info('============= END : Create user ===========');
    }

    async queryAllusers(ctx) {

        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeuserStatus(ctx, userNumber, newStatus) {
        console.info('============= START : changeuserOwner ===========');

        const userAsBytes = await ctx.stub.getState(userNumber); // get the user from chaincode state
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${userNumber} does not exist`);
        }
        const user = JSON.parse(userAsBytes.toString());
        user.userStatus = newStatus;

        await ctx.stub.putState(userNumber, Buffer.from(JSON.stringify(user)));
        console.info('============= END : changeuserOwner ===========');
    }

}

module.exports = User;
