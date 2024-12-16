// saveUserRegistration.test.ts
import { saveUserRegistration } from './saveUserRegistration.db';
import { AppDataSource } from '../data-source';
import { UserInfo } from '../entity/UserInfo.entity';

describe('saveUserRegistration', () => {
    beforeAll(async () => {
        await AppDataSource.initialize();
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    it('should save user registration successfully', async () => {
        const user = await saveUserRegistration(
            'Test Name',
            'Steam Name',
            'Discord Name',
            'test@email.com',
            'password123'
        );

        expect(user).toBeDefined();
        expect(user.user_id).toBeDefined();
        expect(user.duties).toBeUndefined(); // Should not be initialized
        expect(user.dutyLogs).toBeUndefined(); // Should not be initialized
    });
});