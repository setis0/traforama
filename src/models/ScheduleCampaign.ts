type Days = `${'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'}${`${'00' | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23}`}`;


const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const allHours = Array.from(Array(24).keys());

const fullDays = allDays.reduce((a: any, b: any) => a.concat(allHours.map((m: any) => b + (m < 10 ? '0' : '') + m)), []);

export default class ScheduleCampaign {
    constructor(readonly _value: Days[] = fullDays) {

    }


    get value(): Days[] {
        return this._value;
    }

}