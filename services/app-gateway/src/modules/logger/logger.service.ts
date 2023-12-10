import { Scope } from '@nestjs/common';
import {
  Injectable,
  InternalServerErrorException,
  LoggerService,
} from '@nestjs/common';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

@Injectable({ scope: Scope.DEFAULT })
export class MyLoggerService implements LoggerService {
  private date = new Date();
  private loggerPath = 'src/Logs';
  private fileName = '';
  private _serviceName = '';
  private fullPath = '';

  constructor() {
    this.fileName = this.setFileName();
    this.fullPath = this.setFullPath();
    this.createLoggerDir();
  }

  public set serviceName(name: string) {
    this._serviceName = name + ' ';
  }

  public get servicename(): string {
    return this._serviceName;
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.createLogDate(), message, optionalParams.toString());
    this.appendToFile(message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(this.createLogDate(), message, optionalParams.toString());
    this.appendToFile(message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.createLogDate(), message, optionalParams.toString());
    this.appendToFile(message, optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    console.debug(this.createLogDate(), message, optionalParams.toString());
    this.appendToFile(message, optionalParams);
  }

  private createLogDate(): string {
    return `${this.date.getFullYear()}:${this.setMonthPrefix()}:${this.date.getDate()}:${this.date.getHours()}:${this.date.getMinutes()}:${this.date.getSeconds()}:${this.date.getMilliseconds()} ${
      this._serviceName
    }`;
  }

  private setMonthPrefix(): string {
    if (this.date.getMonth() < 10) {
      return `0${this.date.getMonth()}`;
    }
    return `${this.date.getMonth()}`;
  }

  private appendToFile(message: any, ...optionalParams: any[]) {
    if (this.checkIfFileOrDirectoryExists(this.fullPath)) {
      try {
        writeFileSync(
          this.fullPath,
          this.createLogDate() + message + optionalParams.toString() + '\n',
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
  }

  private checkIfFileOrDirectoryExists(path: string): boolean {
    return existsSync(path);
  }

  private createLogFile(fullPath: string, fileName: string): string {
    const splitFileNameDay = fileName.split('-')[2].replace('.', '');
    const day = parseInt(splitFileNameDay);
    if (this.date.getDate() !== day) {
      this.fileName = this.setFileName();
      this.fullPath = this.setFullPath();
      return this.fullPath;
    }
    return fullPath;
  }

  private callWriteFile() {
    try {
      writeFileSync(
        this.createLogFile(this.fullPath, this.fileName),
        `${this.createLogDate()} Logger Started...\n`,
        {
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

  private createLoggerDir() {
    if (this.checkIfFileOrDirectoryExists(this.fullPath)) {
      this.log('Restarting Nest Application...');
      return;
    } else if (!this.checkIfFileOrDirectoryExists(this.loggerPath)) {
      mkdirSync(this.loggerPath);
      this.callWriteFile();
    } else if (this.checkIfFileOrDirectoryExists(this.loggerPath)) {
      this.callWriteFile();
    }
  }

  private setFileName() {
    return `${this.date.getFullYear()}-${this.setMonthPrefix()}-${this.date.getDate()}.log`;
  }

  private setFullPath() {
    return this.loggerPath + '/' + this.fileName;
  }
}
