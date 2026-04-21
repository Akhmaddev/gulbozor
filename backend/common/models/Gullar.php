<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "gullar".
 *
 * @property int $id
 * @property string $gulnomi
 * @property int $gulnarxi
 * @property int $kategoriya_id
 * @property string $gulmalumoti
 * @property string $gulrasmi
 */
class Gullar extends \yii\db\ActiveRecord
{


    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'gullar';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['gulnomi', 'gulnarxi', 'kategoriya_id', 'gulmalumoti', 'gulrasmi'], 'required'],
            [['gulnarxi', 'kategoriya_id'], 'integer'],
            [['gulmalumoti', 'gulrasmi'], 'string'],
            [['gulnomi'], 'string', 'max' => 90],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'gulnomi' => 'Gulnomi',
            'gulnarxi' => 'Gulnarxi',
            'kategoriya_id' => 'Kategoriya ID',
            'gulmalumoti' => 'Gulmalumoti',
            'gulrasmi' => 'Gulrasmi',
        ];
    }

    /**
     * {@inheritdoc}
     * @return GullarQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new GullarQuery(get_called_class());
    }

}
