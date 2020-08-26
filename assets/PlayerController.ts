const {ccclass, property} = cc._decorator;
 
import {PlayerData } from './GameCommonDefine'; 

@ccclass
export default class PlayerControl extends cc.Component {

    speed :number;
    gravity : number;
    dir : number =0;
    public keys: Map<number,boolean> = new Map();
    playerData : PlayerData;

}