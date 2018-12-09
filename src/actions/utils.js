import _ from 'lodash';
import { showDialog } from 'avenaChallenge/src/controls/utils';

export { showDialog };

export const handleError = (fn, errorMessage = '') => async (dispatch, ...rest) => {
  try {
    return await fn(dispatch, ...rest);
  } catch (err) {
    let exceptionMessage = _.isString(err) ? err : _.get(err, 'message', _.get(err, 'responseText', 'Un error desconocido ha ocurrido'));
    if (!_.isString(exceptionMessage)) exceptionMessage = _.get(exceptionMessage, 'text', 'Un error desconocido ha ocurrido');
    await showDialog(errorMessage, exceptionMessage);
  }
};