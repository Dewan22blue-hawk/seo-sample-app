const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictSEOPerformance(model, auditData) {
  try {
    // Preprocessing data SEO Anda untuk input model (contoh: merubah data ke tensor)
    const tensorData = tf.tensor2d([auditData], [1, auditData.length]);

    // Definisikan label klasifikasi performa SEO
    const classes = ["Good", "Average", "Poor"];

    // Lakukan prediksi menggunakan model
    const prediction = model.predict(tensorData);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    // Identifikasi kelas prediksi
    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult];

    // Definisikan rekomendasi berdasarkan kelas
    let explanation, suggestion;
    if (label === "Good") {
      explanation = "Performa SEO Anda baik.";
      suggestion = "Pertahankan strategi SEO Anda saat ini.";
    } else if (label === "Average") {
      explanation = "Performa SEO Anda rata-rata.";
      suggestion =
        "Pertimbangkan untuk mengoptimalkan konten dan meningkatkan kecepatan situs.";
    } else if (label === "Poor") {
      explanation = "Performa SEO Anda kurang baik.";
      suggestion =
        "Rekomendasi: periksa konten, tautan balik, dan kecepatan situs.";
    }

    return { confidenceScore, label, explanation, suggestion };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = predictSEOPerformance;
