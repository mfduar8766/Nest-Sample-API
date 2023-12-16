import { Test, TestingModule } from '@nestjs/testing';
import { MyLoggerService } from './logger.service';

describe('MyLoggerService', () => {
  let service: MyLoggerService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyLoggerService],
    }).compile();

    service = module.get<MyLoggerService>(MyLoggerService);
  });

  it('should have a serviceName', () => {
    const name = 'test';
    service.serviceName = name;
    expect(service.serviceName).not.toBeNull();
  });
  it('should log to console', () => {
    const consoleSpy = jest.spyOn(global.console, 'log');
    service.log(`this is a message`);
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should error to console', () => {
    const consoleSpy = jest.spyOn(global.console, 'error');
    service.error(`this is a message`);
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should warn to console', () => {
    const consoleSpy = jest.spyOn(global.console, 'warn');
    service.warn(`this is a message`);
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should debug to console', () => {
    const consoleSpy = jest.spyOn(global.console, 'debug');
    service.debug(`this is a message`);
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should setFullPath', () => {
    const fullPath = service['setFullPath']();
    const fileName = service['setFileName']();
    expect(fullPath).toEqual(`src/Logs/${fileName}`);
  });
  it('should return a string of log date', () => {
    const createLogData = service['createLogDate']();
    expect(createLogData.length).toBeGreaterThan(1);
  });
  it('should setMonthPrefix', () => {
    const setMonthPrefix = service['setMonthPrefix']();
    expect(setMonthPrefix.length).toBeGreaterThan(1);
  });
  it('should check if dir exists', () => {
    const dirExists = service['checkIfFileOrDirectoryExists']('/test/XYZ');
    expect(dirExists).toBe(false);
  });
});
