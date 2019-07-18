import Ae from '@aeternity/aepp-sdk/es/ae/universal';
import * as types from './mutation-types';
import * as popupMessages from '../popup/utils/popup-messages';
import { convertToAE } from '../popup/utils/helper';
import { FUNGIBLE_TOKEN_CONTRACT } from '../popup/utils/constants';

export default {
  setAccount({ commit }, payload) {
    commit(types.UPDATE_ACCOUNT, payload);
    commit(types.UPDATE_BALANCE);
  },
  setSubAccount({ commit }, payload) {
    commit(types.SET_SUBACCOUNT, payload);
  },
  setSubAccounts({ commit }, payload) {
    commit(types.SET_SUBACCOUNTS, payload);
  },
  switchNetwork({ commit }, payload) {
    browser.storage.sync.set({activeNetwork: payload});
    return new Promise((resolve, reject) => {
      commit(types.SWITCH_NETWORK, payload);
      resolve();
    });
  },
  updateBalance({ commit, state }) {
    // get balance based on new or already fetched api
      state.sdk.balance(state.account.publicKey)
        .then(balance => {
          commit(types.UPDATE_BALANCE, convertToAE(balance) );
        })
        .catch(e => {
          console.log(e);
          commit(types.UPDATE_BALANCE, convertToAE(0) );
        });
  },
  updateBalanceSubaccounts({ commit, state }) {
      state.subaccounts.forEach((sub,index) => {
          state.sdk.balance(sub.publicKey)
          .then(balance => {
            commit(types.UPDATE_SUBACCOUNTS_BALANCE, { account:index, balance: convertToAE(balance) } );
          })
          .catch(e => {
            commit(types.UPDATE_SUBACCOUNTS_BALANCE, { account:index, balance:  convertToAE(0) } );
          });
      });
  },
  updateBalanceTokens({ commit, state }) {
    state.tokens.forEach((tkn, index) => {
        if(typeof tkn.parent != 'undefined' && tkn.contract != '' && tkn.parent == state.account.publicKey) {
          state.sdk.contractCallStatic(FUNGIBLE_TOKEN_CONTRACT,tkn.contract,'balance',[state.account.publicKey])
          .then((res) => {
            res.decode()
            .then(balance => {
              commit(types.UPDATE_TOKENS_BALANCE, { token:index, balance: balance == 'None' ? 0 : balance.Some[0] } );
            })
          })
          .catch(e => {

          })
        }
    })
  },
  updateBalanceToken({commit, state} ) {
    state.sdk.contractCallStatic(FUNGIBLE_TOKEN_CONTRACT,state.tokens[state.current.token].contract,'balance',[state.account.publicKey]) 
    .then((res) => {
      res.decode()
      .then(balance => {
        commit(types.UPDATE_TOKENS_BALANCE, { token:state.current.token, balance: balance == 'None' ? 0 : balance.Some[0] } );
      })
    })
  },
  popupAlert({ commit, state }, payload) {
    switch (payload.name) {
      case 'spend':
        switch (payload.type) {
          case 'insufficient_balance':
            commit(types.SHOW_POPUP,{show:true,...popupMessages.INSUFFICIENT_BALANCE});
            break;
          case 'confirm_transaction':
            commit(types.SHOW_POPUP, {show: true, class: payload.type,data:payload.data, secondBtn:true, secondBtnClick: 'confirmTransaction', ...popupMessages.CONFIRM_TRANSACTION});
            break;
          case 'success_transfer':
            commit(types.SHOW_POPUP,{show:true,secondBtn:true,secondBtnClick:'showTransaction',...popupMessages.SUCCESS_TRANSFER,msg:payload.msg,data:payload.data})
            break;
          case 'success_deploy':
              commit(types.SHOW_POPUP,{show:true,...popupMessages.SUCCESS_DEPLOY,msg:payload.msg})
            break;
          case 'incorrect_address':
            commit(types.SHOW_POPUP,{show:true,...popupMessages.INCORRECT_ADDRESS});
            break;
          case 'incorrect_amount':
            commit(types.SHOW_POPUP,{show:true,...popupMessages.INCORRECT_AMOUNT});
            break;
          case 'transaction_failed':
            commit(types.SHOW_POPUP,{show:true,...popupMessages.TRANSACTION_FAILED});
            break;
          default:
            break;
        }
        break;
      case 'account':
        switch (payload.type) {
          case 'publicKeyCopied':
            commit(types.SHOW_POPUP,{show:true,...popupMessages.PUBLIC_KEY_COPIED});
            break;
          case 'seedFastCopy':
            commit(types.SHOW_POPUP,{show:true,...popupMessages.SEED_FAST_COPY});
            break;
          case 'requiredField':
            commit(types.SHOW_POPUP,{show:true,...popupMessages.REQUIRED_FIELD});
            break;
          case 'added_success':
            commit(types.SHOW_POPUP,{show:true,...popupMessages.SUCCESS_ADDED});
            break;
          case 'token_add':
            commit(types.SHOW_POPUP,{show:true,...popupMessages.INCORRECT_FIELDS_ADD_TOKEN});
            break;
          case 'token_exists':
            commit(types.SHOW_POPUP,{show:true,...popupMessages.TOKEN_ADDED});
          break;
          case 'token_invalid_address':
              commit(types.SHOW_POPUP,{show:true,...popupMessages.TOKEN_INVALID_ADDRESS});
          break;
          case 'only_allowed_chars':
              commit(types.SHOW_POPUP,{show:true,...popupMessages.CHARS_ALLOWED});
            break;
          case 'confirm_privacy_clear':
            commit(types.SHOW_POPUP, { show:true, secondBtn:true, secondBtnClick:'clearPrivacyData',...popupMessages.CONFIRM_PRIVACY_CLEAR})
          break;
          default:
            break;
        }
        break;
      case 'network':
        switch (payload.type) {
          case 'confirm_remove':
            commit(types.SHOW_POPUP, {show: true, class: payload.type,data:payload.data, secondBtn:true, secondBtnClick: 'removeUserNetwork', ...popupMessages.REMOVE_USER_NETWORK});
            break;
          case 'cannot_remove':
            commit(types.SHOW_POPUP, {show:true, ...popupMessages.REMOVE_USER_NETWORK_ACTIVE_ERROR});
            break;
          case 'name_exists':
            commit(types.SHOW_POPUP, {show:true, ...popupMessages.USER_NETWORK_EXISTS_ERROR});
            break;
        }
        break;
      default:
        break;
    }
  },
  getTransactionsByPublicKey({commit,state}, payload) {
    const middlewareUrl = state.network[state.current.network].middlewareUrl;
    let limit = "",page = "" ,param = "";
    let account = payload.publicKey;
    if(payload.limit) {
      limit = "?limit=" + payload.limit;
    }
    if(payload.page) {
      page = "&page=" + payload.page;
    }
    if(payload.param) {
      param = "/" + payload.param;
    }
    return fetch(middlewareUrl + "/middleware/transactions/account/" + account + limit + page + param, {
      method:'GET',
      mode:'cors'
    })
    .then(res => res.json() )
    .catch(err => err);
  },
  updateLatestTransactions({ commit }, payload) {
    commit(types.UPDATE_LATEST_TRANSACTIONS, payload);
  },
  updateAllTransactions({commit, state}, payload) {
    commit(types.UPDATE_ALL_TRANSACTIONS,payload);
  },
  setAccountName({ commit , state}, payload) {
    commit(types.SET_ACCOUNT_NAME, payload);
  },
  setUserNetwork({ commit }, payload) {
    commit(types.SET_USERNETWORK, payload);
  },
  setUserNetworks({ commit }, payload) {
    commit(types.SET_USERNETWORKS, payload);
  },
  initSdk({ commit }, payload) {
    commit(types.INIT_SDK, payload)
  },
  setTokens({ commit }, payload) {
    commit(types.SET_TOKENS, payload)
  }
};
