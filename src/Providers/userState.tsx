import {atom} from 'recoil';

export const userState = atom({
    key: 'userState',
    default: false
})

export const userName = atom({
    key: 'userName',
    default: ''
})

export const member = atom({
    key: 'member',
    default: [] as any[]
})

export const result = atom({
    key: 'result',
    default: [] as any[]
})