<?php

namespace common\models;

use Yii;
use yii\db\Query;
use yii\web\UploadedFile;

class Gullar extends \yii\db\ActiveRecord
{
    /** Formadan/API'dan keladigan vaqtinchalik fayl maydoni (bazada yo'q) */
    public $imageFile;

    public static function tableName()
    {
        return 'gullar';
    }

    public function rules()
    {
        return [
            // gulrasmi required emas: rasm upload() orqali o'zi to'ldiriladi
            [['gulnomi', 'gulnarxi', 'kategoriya_id', 'gulmalumoti', 'soni'], 'required'],
            [['kategoriya_id', 'soni'], 'integer'],
            [['gulnomi', 'gulnarxi', 'gulrasmi'], 'string', 'max' => 255],
            [['gulmalumoti'], 'string'],
            [['imageFile'], 'file',
                'skipOnEmpty' => true,
                'extensions' => 'png, jpg, jpeg, webp',
                'maxSize' => 2 * 1024 * 1024,
                'tooBig' => 'Rasm hajmi 2 MB dan oshmasligi kerak.',
                'wrongExtension' => 'Faqat png, jpg, jpeg, webp formatlar mumkin.',
            ],
        ];
    }

    /**
     * Rasmni frontend/web/images ga saqlaydi va gulrasmi ga fayl nomini yozadi.
     * Rasm tanlanmagan bo'lsa hech narsa qilmaydi (eski rasm saqlanib qoladi).
     */
    public function upload()
    {
        if ($this->imageFile === null) {
            return true;
        }

        $dir = Yii::getAlias('@frontend/web/images/');
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }

        $fileName = uniqid('gul_') . '.' . strtolower($this->imageFile->extension);

        if (!$this->imageFile->saveAs($dir . $fileName)) {
            return false;
        }

        // yangilash paytida eski rasmni o'chiramiz
        if (!$this->isNewRecord && $this->gulrasmi && is_file($dir . $this->gulrasmi)) {
            @unlink($dir . $this->gulrasmi);
        }

        $this->gulrasmi = $fileName;
        return true;
    }

    /** Gul o'chirilganda uning rasm faylini ham serverdan o'chiradi */
    public function afterDelete()
    {
        parent::afterDelete();

        if ($this->gulrasmi) {
            $path = Yii::getAlias('@frontend/web/images/') . $this->gulrasmi;
            if (is_file($path)) {
                @unlink($path);
            }
        }
    }

    public function fields()
    {
        $f = parent::fields();

        // Rasmning to'liq manzili (frontendda to'g'ridan-to'g'ri <img src> ga qo'yiladi)
        $f['rasm_url'] = function ($model) {
            if (!$model->gulrasmi) {
                return null;
            }
            $base = Yii::$app->params['frontendUrl'] ?? '';
            return rtrim($base, '/') . '/images/' . $model->gulrasmi;
        };

        $f['baho'] = function ($model) {
            return round((float)(new Query())
                ->from('izohlar')
                ->where(['gul_id' => $model->id])
                ->average('baho'), 1);
        };

        $f['izohlar_soni'] = function ($model) {
            return (int)(new Query())
                ->from('izohlar')
                ->where(['gul_id' => $model->id])
                ->count();
        };

        return $f;
    }

    public function getKategoriya()
    {
        return $this->hasOne(Kategoriya::class, ['id' => 'kategoriya_id']);
    }
}