const express = require('express');

class QuestionnaireResultDBController {
  constructor() {
    this.db;
    this.sheetNum;
  }

  // 새로운 테이블(시트) 만들기
  addTable(dbController) {
    this.sheetNum = dbController.lastQuestionnaireResultSheet + 1;

    dbController.db.serialize();
    dbController.db.run(
      `CREATE TABLE 'questionnaire_result_${this.sheetNum}'(
        key INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        privacy_policy TEXT NOT NULL,
        upload_date TEXT NOT NULL
      )`,
      (err) => {
        if (err) {
          return console.log(
            `DB: 테이블 생성 오류\n
            테이블 이름: questionnaire_result_${this.sheetNum}
            ==오류 내용==
            ${err}`
          );
        } else {
          dbController.setLastQuestionnaireResultSheet = this.sheetNum;
        }
      }
    );
  }

  updateData(dbController, data, res) {
    // 컴퓨터의 표준 시간 상관 없이 항상 한국 시간이 나타나도록 하기
    const localDate = new Date(); // locale 시간
    // UTC 시간 계산
    const utc = localDate.getTime() + localDate.getTimezoneOffset() * 60 * 1000;
    // UTC -> KST (UTC + 9 시간)
    const KR_TIME_EIFF = 9 * 60 * 60 * 1000;
    const krDate = new Date(utc + KR_TIME_EIFF);
    var nowTimeYear = krDate.getFullYear();
    var nowTimeMonth = ('00' + (krDate.getMonth() + 1)).slice(-2);
    var nowTimeDate = krDate.getDate();
    var nowTimeHur = ('00' + krDate.getHours()).slice(-2);
    var nowTimeMin = ('00' + krDate.getMinutes()).slice(-2);
    var nowTimeSec = ('00' + krDate.getSeconds()).slice(-2);

    // 현재 시간 (처리 시간)
    const date = `${nowTimeYear}-${nowTimeMonth}-${nowTimeDate} ${nowTimeHur}:${nowTimeMin}:${nowTimeSec}`;

    const qury = `
      INSERT INTO 'questionnaire_result_${dbController.lastQuestionnaireResultSheet}'(
        name,
        phone_number,
        privacy_policy,
        upload_date
      )VALUES(
        '${data.name}',
        '${data.phone_number}',
        '${data.privacy_policy}',
        '${date}'
      )`;

    dbController.db.serialize();
    dbController.db.run(qury, (err) => {
      if (err) {
        // 오류가 발생할 경우 추가 시트 생성
        console.log('DB: 새로운 데이터를 저장하지 못 하였습니다. [1]\n' + err);

        // 기존 테이블에 문제가 있었다고 판단하여 새로운 테이블을 생성
        this.addTable(dbController.db);
        setTimeout(() => {
          dbController.db.serialize();
          dbController.db.run(qury, (err) => {
            if (err) {
              console.log('DB: 새로운 데이터를 저장하지 못 하였습니다. [2]\n' + err);
              return res.send({ db_process: false, message: null });
            } else {
              return res.send({ db_process: true });
            }
          });
        }, 800);
      } else {
        // 저장이 완료되면 res로 반환
        return res.send({ db_process: true });
      }
    });
  }
}

module.exports = QuestionnaireResultDBController;
