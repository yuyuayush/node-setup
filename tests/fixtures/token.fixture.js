import { generateToken } from '../../src/services/tokenService.js';
import { userOne } from './user.fixture.js';

const accessTokenExpires = new Date();
accessTokenExpires.setMinutes(accessTokenExpires.getMinutes() + 30);

export const userOneAccessToken = generateToken(userOne._id, accessTokenExpires);
