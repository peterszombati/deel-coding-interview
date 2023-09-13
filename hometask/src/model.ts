import {DataTypes, Model, Sequelize} from "sequelize";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite3'
});

//@ts-ignore
class Profile extends Model {
}

//@ts-ignore
Profile.init(
    {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        profession: {
            type: DataTypes.STRING,
            allowNull: false
        },
        balance: {
            type: DataTypes.DECIMAL(12, 2)
        },
        type: {
            type: DataTypes.ENUM('client', 'contractor')
        }
    },
    {
        sequelize,
        modelName: 'Profile'
    }
);

//@ts-ignore
class Contract extends Model {
}

//@ts-ignore
Contract.init(
    {
        terms: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('new', 'in_progress', 'terminated')
        }
    },
    {
        sequelize,
        modelName: 'Contract'
    }
);

//@ts-ignore
class Job extends Model {
}

//@ts-ignore
Job.init(
    {
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        paid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        paymentDate: {
            type: DataTypes.DATE
        }
    },
    {
        sequelize,
        modelName: 'Job'
    }
);

// @ts-ignore
Profile.hasMany(Contract, {as: 'Contractor', foreignKey: 'ContractorId'})
// @ts-ignore
Contract.belongsTo(Profile, {as: 'Contractor'})
// @ts-ignore
Profile.hasMany(Contract, {as: 'Client', foreignKey: 'ClientId'})
// @ts-ignore
Contract.belongsTo(Profile, {as: 'Client'})
// @ts-ignore
Contract.hasMany(Job)
// @ts-ignore
Job.belongsTo(Contract)


export {
    sequelize,
    Profile,
    Contract,
    Job,
}