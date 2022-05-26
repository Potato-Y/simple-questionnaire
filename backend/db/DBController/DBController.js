const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const questionnaireResultDBController = require('./QuestionnaireResultDBController');

const APPLY_DB_VERSION = 1;
const DB_NAME = path.join(__dirname, '../../Data', 'Questionnaire.sqlite');

class DBController {
  constructor() {
    this.db;
    this.lastQuestionnaireResultSheet = 1;
    this.openDBVersion = 1;
  }

  connectDB() {
    makeFoler('./Data'); // 해당 디렉토리가 없으면 생성

    this.db = new sqlite3.Database(DB_NAME, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('데이터베이스에 연결 완료.');
    });

    // 연결된 DB의 상태를 확인합니다.
    // DB에서 버전 정보를 불러오지 못 한다면 빈 파일로 판단하여 초기 설정을 진행합니다.
    this.db.serialize(() => {
      // 쿼리가 순차적으로 이뤄지도록 한다.

      // DB 버전 확인
      this.db.get(`SELECT * FROM 'client_settings' WHERE id='settings'`, (err, value) => {
        if (err) {
          // 빈 DB파일로 판단
          console.log('DB 버전이 확인되지 않습니다. 기본 정보를 입력합니다.');

          this.db.serialize(() => {
            // 설문 내용을 저장할 테이블
            this.db.run(
              `CREATE TABLE 'questionnaire_result_${this.lastQuestionnaireResultSheet}'(
                key INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone_number TEXT NOT NULL,
                privacy_policy TEXT NOT NULL,
                upload_date TEXT NOT NULL
              )`,
              (err) => {
                if (err) {
                  return console.log(`DB: 테이블 생성 오류\n테이블 이름: questionnaire_result_${this.lastQuestionnaireResultSheet}\n==오류 내용==\n${err}`);
                }
              }
            );

            // 필요 쿼리를 다 수행하고 나면 버전 정보를 마지막으로 입력하도록 설정.
            // 클라이언트 설정 값 테이블 만들기
            this.db.run(
              `CREATE TABLE 'client_settings'(
                id TEXT PRIMARY KEY,
                db_version INTEGER NOT NULL,
                last_questionnaire_result_version INTEGER NOT NULL
              )`,
              (err) => {
                if (err) {
                  return console.log('DB: 테이블을 생성하는 중 오류가 발생하였습니다.\n' + err);
                }
              }
            );

            // DB 버전 정보 입력하기
            this.db.run(
              `INSERT INTO 'client_settings'(
                id,
                db_version,
                last_questionnaire_result_version
              )
              VALUES(
                'settings',
                '${APPLY_DB_VERSION}',
                '${this.lastQuestionnaireResultVersion}'
              )`,
              (err) => {
                if (err) {
                  return console.log('DB: 버전 정보를 입력하는 중 오류가 발생하였습니다.\n' + err);
                }
              }
            );
          });
        } else {
          // DB 버전이 확인되면 정상적인 DB 파일로 판단
          try {
            if (!isNaN(value.db_version)) {
              this.openDBVersion = value.db_version;
              console.log('연결된 DB 버전: ' + this.openDBVersion);

              // DB 업데이트가 필요한 경우 아래에 추가
            } else {
              console.log('버전 정보를 불러오지 못 하였습니다. DB파일이 정상적으로 생성되어 있는지 확인하세요. \n');
            }
          } catch {
            console.log('DB: DB파일을 정상적으로 확인할 수 없습니다. ./Data/~.sqlite 파일을 지운 후 프로그램을 재실행하세요.');
          }
        }
      });
    });
  }

  get getDB() {
    return this.db;
  }

  get getLastQuestionnaireResultVersion() {
    return this.lastQuestionnaireResultVersion;
  }

  set setLastQuestionnaireResultSheet(sheetNum) {
    this.lastQuestionnaireResultSheet = sheetNum;
  }
}

const makeFoler = (dir) => {
  if (!fs.existsSync(dir)) {
    console.log('폴더를 생성합니다.\n * 생성 위치: ' + dir);
    fs.mkdirSync(dir);
  }
};

module.exports = DBController;
