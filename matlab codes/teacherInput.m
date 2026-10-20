function [tc, tb, tt] = teacherInput()
% Teacher pilot values on the 0-100 scale; the prompt repeats until valid.
tc = askValue('Complexity of the paper');
tb = askValue('Syllabus breadth (broad = more taught content = easier)');
tt = askValue('Time pressure');
end

function v = askValue(msg)
v = NaN;
while ~(isscalar(v) && isnumeric(v) && isfinite(v) && v >= 0 && v <= 100)
    v = input([msg ' (0-100): ']);
    if isempty(v), v = NaN; end
end
end
