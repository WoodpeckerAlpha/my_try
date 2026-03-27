module.exports = {
	testEnvironment: "node",

	// Ищем тесты рядом с файлами (*.test.js, *.spec.js)
	testMatch: ["**/*.test.js", "**/*.spec.js"],

	// Игнорируем node_modules
	testPathIgnorePatterns: ["/node_modules/"],

	// Настройка алиасов для импортов (если используете)
	moduleNameMapper: {
		"^@models/(.*)$": "<rootDir>/models/$1",
		"^@services/(.*)$": "<rootDir>/services/$1",
		"^@dto/(.*)$": "<rootDir>/dto/$1",
		"^@exception/(.*)$": "<rootDir>/exception/$1",
	},

	// Очищаем моки между тестами
	clearMocks: true,

	// Показывать покрытие кода (опционально)
	collectCoverage: false,
};
