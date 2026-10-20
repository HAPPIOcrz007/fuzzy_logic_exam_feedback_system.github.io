function plotResults(teacher, ys, names)
N = numel(ys);  m = mean(ys);  med = median(ys);  sd = std(ys);
q = quantile(ys,[0.25 0.75]);
gap = m - teacher;  tol = 10;                     % students minus teacher
if gap > tol,      verdict = 'HARDER than the teacher expected';  light = 'RED';
elseif gap < -tol, verdict = 'EASIER than the teacher expected';  light = 'YELLOW';
else,              verdict = 'about AS EXPECTED';                  light = 'GREEN'; end

fprintf('Teacher estimate : %.2f\n', teacher);
fprintf('Mean / Median    : %.2f / %.2f   Std dev: %.2f\n', m, med, sd);
fprintf('Middle 50%%       : %.2f to %.2f\n', q(1), q(2));
fprintf('Easy %d | Moderate %d | Difficult %d\n', sum(ys<35), sum(ys>=35 & ys<65), sum(ys>=65));
fprintf('Gap              : %+.2f -> %s [%s light]\n', gap, verdict, light);

figure('Name','Difficulty per student');
bar(1:N, ys); hold on;
yline(teacher,'r-','Teacher');  yline(m,'k--','Class mean');
xlabel('Student'); ylabel('Difficulty (0-100)'); ylim([0 100]);

figure('Name','Difficulty distribution');
histogram(ys, 0:10:100); hold on;
xline(teacher,'r-','Teacher');  xline(m,'k--','Class mean');
xlabel('Difficulty score'); ylabel('Number of students');
end
