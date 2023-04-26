export const RU_CAPTCHA_BASE_URL = process.env.RU_CAPTCHA_BASE_URL;
export const RU_CAPTCHA_KEY = process.env.RU_CAPTCHA_KEY;

export const RESPONSE_CODES = {
    SUCCESS: 200, //Успешный ответ
    INTERNAL_SERVER_ERROR: 500, // сервер столкнулся с неожиданной ошибкой, которая помешала ему выполнить запрос.
    BAD_REQUEST: 400, //переводится как «плохой запрос».
    NOT_FOUND: 404, // классический код ответа по протоколу HTTP. Он свидетельствует, что связь с сервером установлена, но данных по заданному запросу на сервере нет.
    NOT_MODIFIED: 304 // Not modified — появляется, если запрашиваемая пользователем страница не претерпела никаких изменения с момента его последнего посещения.
}

export const ERROR_NOT_SET_ID_CAMPAIGN = 'Не установлен ID кампании. Уставноите id кампании и попробуйте еще раз!'