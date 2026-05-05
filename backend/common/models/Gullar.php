<?php
namespace common\models;
use Yii;

class Gullar extends \yii\db\ActiveRecord
{
    public static function tableName() { return 'gullar'; }

    public function rules() {
        return [
            [['gulnomi', 'gulnarxi', 'kategoriya_id', 'gulmalumoti', 'soni'], 'required'],
            [['kategoriya_id', 'soni'], 'integer'],
            [['gulnomi', 'gulnarxi', 'gulrasmi'], 'string', 'max' => 255],
            [['gulmalumoti'], 'string'],
        ];
    }

    public function getKategoriya() {
        return $this->hasOne(Kategoriya::class, ['id' => 'kategoriya_id']);
    }
}
