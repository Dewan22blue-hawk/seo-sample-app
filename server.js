const Hapi = require("@hapi/hapi");
const loadModel = require("./models/loadModel");
const predictSEOPerformance = require("./services/seoInferenceService");

const server = Hapi.server({
  port: 3000,
  host: "localhost",
});

let model;

// Memuat model ketika server dimulai
(async () => {
  try {
    model = await loadModel("path/of/file/seo_model");
  } catch (error) {
    console.error("Gagal memuat model:", error);
  }
})();

// Route untuk API prediksi SEO
server.route({
  method: "POST",
  path: "/api/seo-prediction",
  handler: async (request, h) => {
    try {
      const { auditData } = request.payload;
      if (!auditData || !Array.isArray(auditData)) {
        return h.response({ error: "auditData tidak valid" }).code(400);
      }

      const result = await predictSEOPerformance(model, auditData);
      return h.response(result);
    } catch (error) {
      return h.response({ error: error.message }).code(500);
    }
  },
});

// Jalankan server Hapi
const start = async () => {
  try {
    await server.start();
    console.log(`Server berjalan di ${server.info.uri}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
