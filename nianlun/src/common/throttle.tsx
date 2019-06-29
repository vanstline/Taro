/**
 * @param fn : 回调函数
 * @param threshold : 时间,单位毫秒
 */
export default function throttle(fn: Function, threshold: number = 1500) {
  if (threshold === null) {
    threshold = 1500
  }
  let _lastExecTime: null | number = null;
  let context = this
  return function (...args: any[]): void {
    let _nowTime: number = new Date().getTime();
    if (_nowTime - Number(_lastExecTime) > threshold || !_lastExecTime) {
      fn.apply(context, args);
      _lastExecTime = _nowTime
    }
  }
}