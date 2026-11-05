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
    public function fields()
{
    $f = parent::fields();

    $f['baho'] = function () {
        return round((float)(new \yii\db\Query())
            ->from('izohlar')->where(['gul_id' => $this->id])->average('baho'), 1);
    };
    $f['izohlar_soni'] = function () {
        return (int)(new \yii\db\Query())
            ->from('izohlar')->where(['gul_id' => $this->id])->count();
    };

    return $f;
}
    public function getKategoriya() {
        return $this->hasOne(Kategoriya::class, ['id' => 'kategoriya_id']);
    }
}