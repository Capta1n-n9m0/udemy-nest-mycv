import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToInstance, instanceToPlain } from "class-transformer";
import {UserDto} from "../users/dtos/user.dto";

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {excludeExtraneousValues: true})
      })
    );
  }
}