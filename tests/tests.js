test("add2", function(){
	equal(add2(2), 4, "правильно");
	equal(add2(-1), 1, "правильно");
	equal(add2(0.3), 2.3, "правильно");
});
test("division", function(){
	equal(division(4, 0), false, "правильная обработка деления на ноль");
	equal(division(4, 4), 1, "деления на само себя");
});