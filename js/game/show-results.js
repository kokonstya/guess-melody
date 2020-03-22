import string from '../data/string-data';
import {Time} from '../data/game-data';

export const showResults = (statistics, gameResult) => {
  if (gameResult.time >= Time.MAX) {
    return `${string.result.timeLose}`;
  }
  if (gameResult.lives <= 0) {
    return `${string.result.loseStat}`;
  }
  const userPoints = gameResult.userPoint;
  const points = statistics.map((item) => item.userPoint);
  points.push(userPoints);
  points.sort((a, b) => b - a);
  const players = points.length;
  const place = points.indexOf(userPoints) + 1;
  const rate = Math.floor((players - place) / players * 100);

  return `Вы заняли ${place} место из ${players} игроков. Это лучше, чем у ${rate}% игроков`;
};

