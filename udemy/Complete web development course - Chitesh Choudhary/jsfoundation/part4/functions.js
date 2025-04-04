function orderTea(teaType) {
    function prepareTea() {
        return `Here is your ${teaType} tea.`;
    }
    return prepareTea();
}

console.log(orderTea("green"));
