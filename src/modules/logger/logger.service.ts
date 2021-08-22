import { Scope } from '@nestjs/common';
import {
  Injectable,
  InternalServerErrorException,
  LoggerService,
} from '@nestjs/common';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

/*
  Romulo:
  Make the loggerPath configurable for testing the service.
  Create a new file if the date is a new date.
  Fix the appendToFile func so that the data is appened to the file and displays in the log file.
  If the app is stopped and restarted DONT create a new log file just use existing one and append to it.
  Write unit tests.
*/

const checkIfFileOrDirectoryExists = (path: string): boolean => {
  return existsSync(path);
};

@Injectable({ scope: Scope.DEFAULT })
export class MyLoggerService implements LoggerService {
  private date = new Date();
  private loggerPath = 'src/Logger';
  private fileName = '';
  private _prefix = '';

  constructor() {
    this.fileName = `${
      this.loggerPath
    }/${this.date.getFullYear()}-${this.setMonthPrefix()}-${this.date.getDate()}.log`;
    this.createLoggerDir(this.loggerPath, this.fileName);
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(
      this.createLogDate(),
      `${this._prefix}`,
      message,
      optionalParams.toString(),
    );
    this.appendToFile(message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(
      this.createLogDate(),
      `${this._prefix}`,
      message,
      optionalParams.toString(),
    );
    this.appendToFile(message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(
      this.createLogDate(),
      `${this._prefix}`,
      message,
      optionalParams.toString(),
    );
    this.appendToFile(message, optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    console.debug(
      this.createLogDate(),
      `${this.prefix}`,
      message,
      optionalParams.toString(),
    );
    this.appendToFile(message, optionalParams);
  }

  public set prefix(prefix: string) {
    this._prefix = prefix;
  }

  private createLogDate(): string {
    return `${this.date.getFullYear()}:${this.setMonthPrefix()}:${this.date.getDate()}:${this.date.getHours()}:${this.date.getMinutes()}:${this.date.getSeconds()}:${this.date.getMilliseconds()}`;
  }

  private setMonthPrefix(): string {
    if (this.date.getMonth() < 10) {
      return `0${this.date.getMonth()}`;
    }
    return `${this.date.getMonth()}`;
  }

  private appendToFile(message: any, ...optionalParams: any[]) {
    try {
      writeFileSync(
        this.fileName,
        `${
          (this.createLogDate(),
          `${this._prefix}`,
          message,
          optionalParams.toString())
        }\n`,
        {
          flag: 'a',
          encoding: 'utf-8',
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error creating or writing to file',
      );
    }
  }

  private createLoggerDir(loggerPath: string, fileName: string) {
    if (!checkIfFileOrDirectoryExists(loggerPath)) {
      mkdirSync(loggerPath);
    }
    try {
      writeFileSync(fileName, `${this.createLogDate()} Logger Started\n`, {
        encoding: 'utf-8',
      });
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error creating or writing to file',
      );
    }
  }
}
