function saveStudentPlots(names, infos, teacherInfo)
% Empty results/ and save one SVG per student (and the teacher) showing the
% fuzzification of C, B, T and the aggregated output with its centroid.
folder = 'results';
if ~exist(folder,'dir'), mkdir(folder); end
old = dir(folder);
for k = 1:numel(old)                              % empty the folder first
    if ~old(k).isdir, delete(fullfile(folder, old(k).name)); end
end

N  = numel(names);
wb = waitbar(0, 'Building results/ - please wait');
f  = figure('Visible','off','Position',[100 100 1000 620]);
for i = 0:N
    if i == 0, info = teacherInfo; label = 'Teacher (pilot)'; fn = 'teacher.svg';
    else,      info = infos{i};    label = sprintf('%d. %s', i, names(i));
               fn = sprintf('student_%03d_%s.svg', i, regexprep(char(names(i)),'\W+','_'));
    end
    clf(f);  drawOne(info, label);
    saveas(f, fullfile(folder, fn));
    waitbar((i+1)/(N+1), wb, sprintf('Building results/ %d of %d', i+1, N+1));
end
close(f); close(wb);
end

function drawOne(info, label)
[IN, OUT] = fuzzySets();  xs = info.xs;  col = lines(3);
vals = [info.c info.b info.t];  mus = [info.mc; info.mb; info.mt];
ttl  = {'Complexity','Breadth (inverse)','Time'};
for p = 1:3
    subplot(2,3,p); hold on;
    for m = 1:3, plot(xs, trapMF(xs, IN(m,:)), 'Color', col(m,:), 'LineWidth', 1.6); end
    xline(vals(p), 'k--');  plot(vals(p), mus(p,:), 'ko', 'MarkerFaceColor','k');
    title(sprintf('%s = %.1f', ttl{p}, vals(p))); ylim([0 1.05]); xlim([0 100]);
    if p == 1, legend('Low','Medium','High','Location','north'); end
end
subplot(2,3,4:6); hold on;
area(xs, info.agg, 'FaceColor',[0.7 0.55 1], 'FaceAlpha',0.5);
for m = 1:3, plot(xs, trapMF(xs, OUT(m,:)), ':', 'Color', col(m,:), 'LineWidth', 1.2); end
xline(info.y, 'c-', sprintf('centroid %.2f', info.y), 'LineWidth', 2);
title(sprintf('%s  -  Easy %.2f | Moderate %.2f | Difficult %.2f  ->  difficulty %.2f', ...
      label, info.w(1), info.w(2), info.w(3), info.y));
xlabel('Difficulty (0-100)'); ylim([0 1.05]); xlim([0 100]);
end
