
import * as constants from '../../constants/app'
import { base } from '../../../services/config'

const INITIAL_STATE ={
    //请求接口域名地址
    baseURL : base ,
    //应用首次加载
    appOnLaunch : true ,
    //请求token
    authorize : ''
}

export default function app( state = INITIAL_STATE , action ){
    switch (action.type){
        case constants.CHANGE_APP_ON_LAUNCH :
            return {
                ...state ,
                appOnLaunch : false
            };
        case constants.INSERT_AUTHORIZE :
            return {
                ...state ,
                authorize : action.authorize
            };
        default :
            return state;
    }
}