import {assert} from 'chai';
import {formatWord} from './utils';

describe(`Show results`, () => {
  it(`should return минуту`, () => {
    assert.equal(formatWord(1, `min`), `минуту`);
  });

  it(`should return секунды`, () => {
    assert.equal(formatWord(3, `sec`), `секунды`);
  });

  it(`should return ошибок`, () => {
    assert.equal(formatWord(5, `note`), `ошибок`);
  });

  it(`should return балла`, () => {
    assert.equal(formatWord(3, `point`), `балла`);
  });

  it(`should return быстрый`, () => {
    assert.equal(formatWord(1, `fast`), `быстрый`);
  });

});

