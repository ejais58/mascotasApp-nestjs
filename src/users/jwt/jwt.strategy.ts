import { Injectable, UnauthorizedException, HttpException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../jwt/interfaces/jwtPayload';




@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'jwtConstants.secret'
    });
  }

  async validate(payload: JwtPayload) {
   


    // if(!(payload.roll == 'admin')){
    //   throw new HttpException('forbidden', 403);
    // }
    
    // if (payload.id !== id){
    //     throw new HttpException('forbidden', 403);
    // }

    return { payload };
  }
}