"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const config_module_1 = require("../config/config.module");
const config_1 = require("@nestjs/config");
const mongoose_2 = require("mongoose");
exports.databaseProviders = [
    mongoose_1.MongooseModule.forRootAsync({
        imports: [config_module_1.ConfigModule],
        useFactory: async (configService) => {
            const uri = configService.get('MONGODB_URI');
            try {
                await mongoose_2.default.connect(uri);
                console.log('Database connected successfully');
                return { uri };
            }
            catch (error) {
                console.error('Error connecting to database:', error);
                throw error;
            }
        },
        inject: [config_1.ConfigService],
    }),
];
//# sourceMappingURL=database.service.js.map