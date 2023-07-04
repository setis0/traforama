type Days = `${'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'}${`${'00' | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23}`}`;
export default class ScheduleCampaign {
    readonly _value: Days[];
    constructor(_value?: Days[]);
    get value(): Days[];
}
export {};
