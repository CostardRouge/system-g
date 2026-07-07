using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using System.IO;
using System.Collections;
using System.Reflection;
using System.Threading;
using Microsoft.DirectX.DirectSound;
using Buffer = Microsoft.DirectX.DirectSound.Buffer;

namespace SystemG
{
    public partial class FormG : Form
    {
        private Device applicationDevice = null;
        private SecondaryBuffer applicationBuffer = null;

        private Dictionary<string, string> dictNote;
        private Dictionary<string, string> dictRun;
        private ArrayList al1;
        private ArrayList al2;
        private SystemG.BeepCl theBeeper;
        private Thread pThread;
		BufferDescription desc;
		BufferPlayFlags PlayFlags;
        private int playing; // 0=Not Playing(Stopped) && 1=Playing && 2=Selection playing && 3=Paused
        private int ix;
        public string[] instrName;
        public double[] instrValue;

        public FormG()
        {
            InitializeComponent();
            dictNote = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            dictRun = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            al1 = new ArrayList();
            al2 = new ArrayList();
            theBeeper = new SystemG.BeepCl(this.Handle);
			desc = new BufferDescription();
			desc.ControlFrequency = true;
			desc.ControlPan = true;
			desc.ControlVolume = true;
			desc.GlobalFocus = true;
			PlayFlags = 0;
            System.Windows.Forms.Form.CheckForIllegalCrossThreadCalls = false;
			Application.CurrentCulture = System.Globalization.CultureInfo.InvariantCulture;
			playing = 0;
            listViewNote.AllowDrop = true;
            ix = 0;
            instrName = new string[18];
            instrValue = new double[18];
			pictureBoxPlay.Image = imageList1.Images[1];
			pictureBoxSelect.Image = imageList1.Images[3];
			pictureBoxStop.Image = imageList1.Images[7];

            applicationDevice = new Device();
            applicationDevice.SetCooperativeLevel(this, CooperativeLevel.Priority);

			toolStripComboBoxNote.SelectedIndex = 0;
			PopulateComboInstr();
        }


        private void PopulateComboInstr()
        {
            instrName[0] = "Brass_1"; instrValue[0] = 17.5;
            instrName[1] = "Brass_2"; instrValue[1] = 35.05;
            instrName[2] = "Elixia_Organ"; instrValue[2] = 41.9;
            instrName[3] = "Flute"; instrValue[3] = 72;
            instrName[4] = "Flute_Low"; instrValue[4] = 35.4;
            instrName[5] = "Guitar_1"; instrValue[5] = 32;
            instrName[6] = "Guitar_2"; instrValue[6] = 47;
            instrName[7] = "Harp"; instrValue[7] = 55.45;
            instrName[8] = "Oboe"; instrValue[8] = 75;
            instrName[9] = "Organ"; instrValue[9] = 56.2;
            instrName[10] = "Oud"; instrValue[10] = 66.65;
            instrName[11] = "Oud_Tremolo"; instrValue[11] = 56;
            instrName[12] = "Piano_2"; instrValue[12] = 41.695;
            instrName[13] = "Piano_3"; instrValue[13] = 41.7;
            instrName[14] = "String_0"; instrValue[14] = 25.255;
            instrName[15] = "String_1"; instrValue[15] = 25.27;
            instrName[16] = "String_2"; instrValue[16] = 32;
            instrName[17] = "Violin"; instrValue[17] = 40;

            comboBoxInstr.DataSource = instrName;
            for (int i = 0; i < 18; i++) instrName[i] = instrName[i].ToLower();
        }

        private void toolStripComboBoxNote_SelectedIndexChanged(object sender, EventArgs e)
		{
			int c = 1;
            string line;

            dictNote.Clear();
            dictRun.Clear();
            listViewNote.Items.Clear();
            listViewRun.Items.Clear();
            al1.Clear();
            al2.Clear();
            this.KeyPreview = false;
            toolStripLabelRun.Text = "Run File";

            string[] notes = null;

            Stream stream = toolStripComboBoxNote.SelectedIndex == 0 ? Assembly.GetExecutingAssembly().GetManifestResourceStream("SystemG.Resources.occidental_scale.txt") : Assembly.GetExecutingAssembly().GetManifestResourceStream("SystemG.Resources.oriental_scale.txt");
            StreamReader sr = new StreamReader(stream);

            while ((line = sr.ReadLine()) != null)
            {
                line = line.Trim();
				if (line == "") continue;
                if (line.StartsWith("#"))
                {
                    listViewNote.Items.Add(line).BackColor = Color.PaleGreen;
                    continue;
                }

                notes = line.Split('=');

				notes[0] = notes[0].Trim();
                notes[1] = notes[1].Trim();

                if (++c % 2 == 0) listViewNote.Items.Add(new ListViewItem(notes)).BackColor = Color.LightBlue;
                else listViewNote.Items.Add(new ListViewItem(notes)).BackColor = Color.Beige;

                try { dictNote.Add(notes[0], notes[1]); }
                catch (ArgumentException) {}
            }
            sr.Close();
            pictureBoxPlay.Enabled = false;
            pictureBoxPlay.Image = imageList1.Images[1];
            playToolStripMenuItem.Enabled = false;
			playToolStripMenuItem1.Enabled = false;
            pictureBoxSelect.Enabled = false;
            pictureBoxSelect.Image = imageList1.Images[3];
            SelToolStripMenuItem.Enabled = false;
			playSelectionToolStripMenuItem.Enabled = false;
			toolStripLabelSec.Text = "";
            textBoxHz.Text = "";
            textBoxms.Text = "";

			toolStripButtonRun.Enabled = true;
			toolStripMenuItem2.Enabled = true;
			runFileToolStripMenuItem.Enabled = true;
            listViewRun.AllowDrop = true;
            StatusLabel1.Text = "Note File loaded";
        }

        private void buttonRunL_Click(object sender, EventArgs e)
        {
            OpenFileDialog openFileD = new OpenFileDialog();
            openFileD.Title = "Open the Run File";
            openFileD.Filter = "Text files (*.txt)|*.txt|All files (*.*)|*.*";
            if (openFileD.ShowDialog(this) == DialogResult.OK)
            {
                LoadRunFile(openFileD.FileName);
            }

        }

        private void LoadRunFile(string fn)
        {
            int i, l, c = 1;
			double value = 0.0;
			int lnum = 1;
            string[] notes = null;
            string line;
            Char[] var;
            string strkey = null, strnew, strvalue = null;
            string[] lvs = new string[4];
            string error = null;
            double sum = 0;
            string filename = fn.Substring(fn.LastIndexOf('\\') + 1);

            listViewRun.Items.Clear();
			this.KeyPreview = false;
            dictRun.Clear();
            al1.Clear();
            al2.Clear();
            bool first = true;

            StreamReader sr = new StreamReader(fn);
            while ((line = sr.ReadLine()) != null)
            {
                line = line.Trim();
				if (line == "") { lnum++; continue; }
                if (first && line.StartsWith("@"))
                {
                    if (line.Substring(1).Trim().ToLower().Equals("oriental"))
                        toolStripComboBoxNote.SelectedIndex = 1;
                    else if (line.Substring(1).Trim().ToLower().Equals("occidental"))
                        toolStripComboBoxNote.SelectedIndex = 0;
                    else error += "- Line " + lnum + ":  Error in " + line + "\n";

                    first = false;
                    continue;
                }
                if (line.StartsWith("#"))
                {
                    al1.Add(-1.0); al2.Add(-1.0);
                    listViewRun.Items.Add(line).BackColor = Color.PaleGreen;
					lnum++;
                    continue;
                }
                if (line.Contains("="))
                {
                    notes = line.Split('=');
					if (notes.Length != 2 || notes[0] == "" || notes[1] == "")
                    {
                        error += "- Line " + lnum + ":  Error in " + line + "\n";
                        continue;
                    }
                    al1.Add(-1.0); al2.Add(-1.0);
                    notes[0] = notes[0].Trim();
                    notes[1] = notes[1].Trim();
                    listViewRun.Items.Add(new ListViewItem(notes)).BackColor = Color.Orange;

                    if (dictRun.ContainsKey(notes[0])) dictRun.Remove(notes[0]);
                    dictRun.Add(notes[0], notes[1]);

					lnum++;
                    first = false;
                    continue;
                }
				if (line.StartsWith("$"))
				{
					al1.Add(-9.0); al2.Add(-9.0);
					string inst = line.Substring(1).Trim().ToLower();
					listViewRun.Items.Add(inst).BackColor = Color.Orchid;

                    if (Array.IndexOf<string>(instrName, inst)==-1) error += "- Line " + lnum + ":  " + inst + " not found in the instrument list\n";
					lnum++;
                    first = false;
					continue;
				}

                notes = line.Split(',');
                if (notes.Length != 2 || notes[0]=="" || notes[1]=="")
                {
                    error += "- Line " + lnum + ":  Error in " + line + "\n";
					lnum++;
                    first = false;
                    continue;
                }

                lvs[0] = notes[0].Trim();
                lvs[2] = notes[1].Trim();

                for (int n = 0; n < 3; n += 2)
                {
                    strnew = lvs[n];

                    while (System.Text.RegularExpressions.Regex.Match(strnew, @"[a-zA-Z]").Success)
                    {
                        if (strnew.Contains("*") || strnew.Contains("/") || strnew.Contains("+") || strnew.Contains("-"))
                        {
                            var = strnew.ToCharArray();
                            for (i = 0; i < strnew.Length; i++)
                            {
                                if (Char.IsLetter(var[i]))
                                {
                                    l = 0;
                                    while (l + i < var.Length && var[l + i] != '*' && var[l + i] != '/' && var[l + i] != '+' && var[l + i] != '-' && var[l + i] != ')' && var[l + i] != ' ') l++;

                                    strkey = strnew.Substring(i, l);
                                    strnew = strnew.Remove(i, l);
                                    if (dictRun.ContainsKey(strkey)) strvalue = "(" + dictRun[strkey] + ")";
                                    else
                                    {
                                        try { strvalue = "(" + dictNote[strkey] + ")"; }
                                        catch (KeyNotFoundException)
                                        {
                                            error += "- Line " + lnum + ":  " + strkey + " is not defined\n";
                                            break;
                                        }
                                    }
                                    strnew = strnew.Insert(i, strvalue);
                                    var = strnew.ToCharArray();
                                    i = -1;
                                }
                            }
                        }
                        else
                        {
                            if (dictRun.ContainsKey(strnew)) strnew = dictRun[strnew];
                            else
                            {
                                try { strnew = dictNote[strnew]; }
                                catch (KeyNotFoundException)
                                {
                                    error += "- Line " + lnum + ":  " + strnew + " is not defined\n";
                                    break;
                                }
                            }
                        }
                    }

					try { value = JsMath.Eval(strnew); }
					catch (Exception) {}

					if (value < 0 || value > 32767) error += "- Line " + lnum + ":  " + lvs[n] + " = " + Math.Round(value) + ", has a wrong value\n";

					if (n == 0)
					{
						al1.Add(value);
						lvs[1] = value.ToString("0");
					}
					else
					{
						al2.Add(value);
						sum += value;
						lvs[3] = value.ToString("##");
					}
                }

                first = false;
				lnum++;

				if (++c % 2 == 0) listViewRun.Items.Add(new ListViewItem(lvs)).BackColor = Color.LightBlue;
				else listViewRun.Items.Add(new ListViewItem(lvs)).BackColor = Color.Beige;
            }
            sr.Close();
            pictureBoxSelect.Enabled = false;
            pictureBoxSelect.Image = imageList1.Images[3];
            SelToolStripMenuItem.Enabled = false;
			playSelectionToolStripMenuItem.Enabled = false;
            textBoxHz.Text = "";
            textBoxms.Text = "";
            ix = 0;
            if (error != null)
            {
                MessageBox.Show("\nERRORS in " + filename + ":\n\n" + error, "Errors in Run File", MessageBoxButtons.OK, MessageBoxIcon.Error);
                listViewRun.Items.Clear();
                toolStripLabelRun.Text = "Run File";
                pictureBoxPlay.Enabled = false;
                pictureBoxPlay.Image = imageList1.Images[1];
                playToolStripMenuItem.Enabled = false;
				playToolStripMenuItem1.Enabled = false;
				toolStripLabelSec.Text = "";
				StatusLabel1.Text = "";
                return;
            }
            TimeSpan t = TimeSpan.FromMilliseconds(sum);
            toolStripLabelSec.Text = string.Format("{0:D2}:{1:D2}:{2:D2}.{3:D3}", t.Hours, t.Minutes, t.Seconds, t.Milliseconds);
            toolStripLabelRun.Text = filename + " (" + al1.Count + ")";
			if (instrName.Length > 0)
			{
				pictureBoxPlay.Enabled = true;
				pictureBoxPlay.Image = imageList1.Images[0];
				playToolStripMenuItem.Enabled = true;
				playToolStripMenuItem1.Enabled = true;
				this.KeyPreview = true;
			}
			StatusLabel1.Text = "Run File loaded";
        }


        private void pictureBoxPlay_Click(object sender, EventArgs e)
        {
            if (playing==1)
            {
                playing = 3;
                StatusLabel1.Text = "Paused";
				playToolStripMenuItem.Text = "&Play";
				playToolStripMenuItem1.Text = "&Play";
				pictureBoxStop_Click(sender, e);
            }
            else if (playing==0 || playing==3)
            {
                pThread = new Thread(new ThreadStart(this.PlayAll));

                ControlsPlay();
                pictureBoxPlay.Image = imageList1.Images[4];
				playToolStripMenuItem.Text = "&Pause";
				playToolStripMenuItem1.Text = "&Pause";
				listViewRun.EnsureVisible(ix);
                listViewRun.SelectedItems.Clear();
                StatusLabel1.Text = "Playing";
                playing = 1;

                pThread.Start();
            }
        }

        private void PlayAll()
        {
            int not, dur;
            int lc = listViewRun.Items.Count;

            if (radioButtonInstr.Checked)
            {
                InitiateBuffer(instrName[comboBoxInstr.SelectedIndex]);
                double offs = instrValue[comboBoxInstr.SelectedIndex] + (double)numericUpDown1.Value;

                int[] arr1 = new int[al1.Count];

				for (int i = ix; i < arr1.Length; i++)
				{
                    if ((double)al2[i] == -9.0 && !checkBoxInstr.Checked) offs = instrValue[Array.IndexOf<string>(instrName, listViewRun.Items[i].Text)] + (double)numericUpDown1.Value;
					arr1[i] = (int)Math.Round((double)al1[i] * offs);
				}

                for (; ix < arr1.Length; ix++)
                {
					dur = (int)(double)al2[ix];

					if (dur < 0)
					{
						if (dur == -9 && !checkBoxInstr.Checked) InitiateBuffer(listViewRun.Items[ix].Text);
						continue;
					}

                    if (ix + 13 < lc) listViewRun.EnsureVisible(ix + 13);
                    listViewRun.Items[ix].Selected = true;
                    textBoxHz.Text = ((double)al1[ix]).ToString("0");
                    textBoxms.Text = dur.ToString();

                    if (arr1[ix] != 0)
                    {
                        applicationBuffer.Frequency = arr1[ix];
                        applicationBuffer.SetCurrentPosition(0);
                        applicationBuffer.Play(0, PlayFlags);
                        Thread.Sleep(dur);
                    }
                    else
                    {
                        applicationBuffer.Stop();
                        Thread.Sleep(dur);
                    }
                    listViewRun.Items[ix].Selected = false;
                }
                applicationBuffer.Stop();
            }
            else if (radioButtonSpeaker.Checked)
            {
				double notD;
                theBeeper.SquareWave = checkBoxSW.Checked;
                for (; ix < al1.Count; ix++)
                {
					dur = (int)(double)al2[ix];
                    if (dur < 0) continue;
                    notD = (double)al1[ix];

                    if (ix + 13 < lc) listViewRun.EnsureVisible(ix + 13);
                    listViewRun.Items[ix].Selected = true;
                    textBoxHz.Text = notD.ToString("0");
                    textBoxms.Text = dur.ToString();

                    if (notD != 0) theBeeper.Beep(notD, dur);
                    else Thread.Sleep(dur);

                    listViewRun.Items[ix].Selected = false;
                }
            }
            else if (radioButtonPC.Checked)
            {
                for (; ix < al1.Count; ix++)
                {
					dur = (int)(double)al2[ix];
					if (dur < 0) continue;
                    not = (int) Math.Round((double)al1[ix]);

                    if (ix + 13 < lc) listViewRun.EnsureVisible(ix + 13);
                    listViewRun.Items[ix].Selected = true;
                    textBoxHz.Text = not.ToString();
                    textBoxms.Text = dur.ToString();

                    if (not != 0) Console.Beep(not, dur);
                    else Thread.Sleep(dur);

                    listViewRun.Items[ix].Selected = false;
                }
            }

            ix = 0;
            playing = 0;
            StatusLabel1.Text = "";
            ControlsStop();
        }

        private void pictureBoxSelect_Click(object sender, EventArgs e)
        {
            pThread = new Thread(new ThreadStart(this.PlaySelection));

            ControlsPlay();
            pictureBoxPlay.Image = imageList1.Images[1];
            pictureBoxPlay.Enabled = false;
            playToolStripMenuItem.Enabled = false;
			playToolStripMenuItem1.Enabled = false;
			StatusLabel1.Text = "Playing selection";
            playing = 2;

            listViewRun.EnsureVisible(listViewRun.SelectedIndices[0]);

            pThread.Start();
        }

        private void PlaySelection()
        {
            int not, dur;
            int lc = listViewRun.Items.Count;

            if (radioButtonInstr.Checked)
            {
                InitiateBuffer(instrName[comboBoxInstr.SelectedIndex]);
                double offs = instrValue[comboBoxInstr.SelectedIndex] + (double)numericUpDown1.Value;

                foreach (int si in listViewRun.SelectedIndices)
                {
                    ix = si;
					dur = (int)(double)al2[si];

					if (dur < 0)
					{
						if (dur == -9 && !checkBoxInstr.Checked)
						{
							offs = instrValue[Array.IndexOf<string>(instrName, listViewRun.Items[si].Text)] + (double)numericUpDown1.Value;
							InitiateBuffer(listViewRun.Items[si].Text);
						}
						continue;
					}
					
					not = (int) Math.Round((double)al1[si] * offs);
                    textBoxHz.Text = "" + Math.Round((double)al1[si]);
                    textBoxms.Text = dur.ToString();

                    if (si+13 < lc) listViewRun.EnsureVisible(si+13);
                    listViewRun.Items[si].Selected = false;

                    if (not != 0)
                    {
                        applicationBuffer.Frequency = not;
                        applicationBuffer.SetCurrentPosition(0);
                        applicationBuffer.Play(0, PlayFlags);
                        Thread.Sleep(dur);
                    }
                    else
                    {
                        applicationBuffer.Stop();
                        Thread.Sleep(dur);
                    }
                    listViewRun.Items[si].Selected = true;
                }
                applicationBuffer.Stop();
            }
            else if (radioButtonSpeaker.Checked)
            {
				double notD;
                theBeeper.SquareWave = checkBoxSW.Checked;
                foreach (int si in listViewRun.SelectedIndices)
                {
                    ix = si;
					dur = (int)(double)al2[si];
					if (dur < 0) continue;
                    notD = (double)al1[si];
                    textBoxHz.Text = notD.ToString("0");
                    textBoxms.Text = dur.ToString();

                    if (si+13 < lc) listViewRun.EnsureVisible(si+13);
                    listViewRun.Items[si].Selected = false;

                    if (notD != 0) theBeeper.Beep(notD, dur);
                    else Thread.Sleep(dur);

                    listViewRun.Items[si].Selected = true;
                }
            }
            else if (radioButtonPC.Checked)
            {
                foreach (int si in listViewRun.SelectedIndices)
                {
                    ix = si;
					dur = (int)(double)al2[si];
					if (dur < 0) continue;
                    not = (int) Math.Round((double)al1[si]);
                    textBoxHz.Text = not.ToString();
                    textBoxms.Text = dur.ToString();

                    if (si+13 < lc) listViewRun.EnsureVisible(si+13);
                    listViewRun.Items[si].Selected = false;

                    if (not != 0) Console.Beep(not, dur);
                    else Thread.Sleep(dur);

                    listViewRun.Items[si].Selected = true;
                }
            }
            ix = 0;
            playing = 0;
            StatusLabel1.Text = "";
            ControlsStop();
        }

		private void InitiateBuffer(string instrument)
		{
			if (null != applicationBuffer) applicationBuffer.Dispose();

            applicationBuffer = new SecondaryBuffer(Assembly.GetExecutingAssembly().GetManifestResourceStream("SystemG.Resources." + instrument.ToLower() + ".wav"), desc, applicationDevice);
            comboBoxInstr.Text = instrument;
		}

        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void pictureBoxStop_Click(object sender, EventArgs e)
        {
            if (null != applicationBuffer)
            {
                applicationBuffer.Stop();
                applicationBuffer.SetCurrentPosition(0);
            }
            theBeeper.StopPlay();
            pThread.Abort();

			if (sender == null || sender == pictureBoxStop || sender == stopToolStripMenuItem || sender == stopToolStripMenuItem1)
            {
                if (playing == 2) listViewRun.Items[ix].Selected = true;
                if (playing!=2) listViewRun.SelectedItems.Clear();
                StatusLabel1.Text = "Stopped";
                playing = 0;
                ix = 0;
            }
            ControlsStop();
        }

        private void ControlsPlay()
        {
            pictureBoxStop.Enabled = true;
            pictureBoxStop.Image = imageList1.Images[6];
            stopToolStripMenuItem.Enabled = true;
			stopToolStripMenuItem1.Enabled = true;

            pictureBoxSelect.Enabled = false;
            pictureBoxSelect.Image = imageList1.Images[3];
            SelToolStripMenuItem.Enabled = false;
			playSelectionToolStripMenuItem.Enabled = false;

			toolStripComboBoxNote.Enabled = false;
            toolStripButtonRun.Enabled = false;
			toolStripMenuItem2.Enabled = false;
            runFileToolStripMenuItem.Enabled = false;

            listViewRun.Focus();
        }

        private void ControlsStop()
        {
            if (playing == 3)
            {
                pictureBoxStop.Enabled = true;
                pictureBoxStop.Image = imageList1.Images[6];
                stopToolStripMenuItem.Enabled = true;
				stopToolStripMenuItem1.Enabled = true;

                pictureBoxPlay.Enabled = true;
                pictureBoxPlay.Image = imageList1.Images[0];
                playToolStripMenuItem.Enabled = true;
				playToolStripMenuItem1.Enabled = true;
			}
            else if (playing == 0)
            {
                pictureBoxStop.Enabled = false;
                pictureBoxStop.Image = imageList1.Images[7];
                stopToolStripMenuItem.Enabled = false;
				stopToolStripMenuItem1.Enabled = false;

				textBoxHz.Text = "";
				textBoxms.Text = "";

                pictureBoxPlay.Enabled = true;
                pictureBoxPlay.Image = imageList1.Images[0];
                playToolStripMenuItem.Enabled = true;
				playToolStripMenuItem.Text = "&Play";
				playToolStripMenuItem1.Enabled = true;
				playToolStripMenuItem1.Text = "&Play";

                if (listViewRun.SelectedItems.Count > 0)
                {
                    pictureBoxSelect.Enabled = true;
                    pictureBoxSelect.Image = imageList1.Images[2];
                    SelToolStripMenuItem.Enabled = true;
					playSelectionToolStripMenuItem.Enabled = true;
                }
				toolStripComboBoxNote.Enabled = true;
                toolStripButtonRun.Enabled = true;
				toolStripMenuItem2.Enabled = true;
                runFileToolStripMenuItem.Enabled = true;
            }
        }

        private void aboutToolStripMenuItem_Click(object sender, EventArgs e)
        {
            MessageBox.Show("Copyright © 2009 Faraj Elias\n\nE-mail: farajelias@hotmail.com", "G System player", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        private void listViewRun_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (listViewRun.SelectedItems.Count > 0 && playing == 0 && instrName.Length > 0)
            {
                pictureBoxSelect.Enabled = true;
				pictureBoxSelect.Image = imageList1.Images[2];
                SelToolStripMenuItem.Enabled = true;
				playSelectionToolStripMenuItem.Enabled = true;
            }
            else
            {
                pictureBoxSelect.Enabled = false;
				pictureBoxSelect.Image = imageList1.Images[3];
				SelToolStripMenuItem.Enabled = false;
				playSelectionToolStripMenuItem.Enabled = false;
            }
        }

		private void FormG_FormClosing(object sender, FormClosingEventArgs e)
		{
			if (null != applicationBuffer) applicationBuffer.Stop();
			if (null != pThread) pThread.Abort();
		}

        private void FormG_KeyDown(object sender, KeyEventArgs e)
        {
            if ((playing == 0 || playing == 1 || playing == 3) && e.KeyCode == Keys.F5) pictureBoxPlay_Click(sender, e);

            else if ((playing == 1 || playing == 2 || playing == 3) && e.KeyCode == Keys.F6) pictureBoxStop_Click(null, null);

            else if (playing == 0 && e.KeyCode == Keys.F7 && listViewRun.SelectedItems.Count > 0) pictureBoxSelect_Click(sender, e);
        }

        private void listViewRun_DragEnter(object sender, DragEventArgs e)
        {
            if (playing==0 && e.Data.GetDataPresent(DataFormats.FileDrop)) e.Effect = DragDropEffects.Copy;
            else e.Effect = DragDropEffects.None;
        }
        private void listViewRun_DragDrop(object sender, DragEventArgs e)
        {
            if (playing==0 && e.Data.GetDataPresent(DataFormats.FileDrop))
            {
                string[] files = (string[])e.Data.GetData(DataFormats.FileDrop);
                if (files[0].EndsWith(".txt"))  LoadRunFile(files[0]);
            }
            this.Activate();
        }


		private string[] SplitStr(string str)
		{
			ArrayList arrL = new ArrayList();

			char[] ch = {'+','-','*','/','(',')'};
			string [] sstr = str.Split(ch);

			for (int i = 0; i < sstr.Length; i++) if (System.Text.RegularExpressions.Regex.Match(sstr[i], @"[a-zA-Z]").Success) arrL.Add(sstr[i]);

			string[] newstr = new string[arrL.Count];
			for (int i = 0; i < newstr.Length; i++) newstr[i] = arrL[i].ToString();
			
			return newstr;
		}


		private void FindNote_Click(object sender, EventArgs e)
		{
			ListViewItem lvi;
			string n = sender.ToString();

			if (dictRun.ContainsKey(n))
			{
				lvi = listViewRun.FindItemWithText(n, false, 0, false);
				if (lvi != null)
				{
					listViewRun.Focus();
					listViewRun.EnsureVisible(lvi.Index);
					listViewRun.Items[lvi.Index].Selected = true;
				}
			}
			else
			{
				lvi = listViewNote.FindItemWithText(n, false, 0, false);
				if (lvi != null)
				{
					listViewNote.Focus();
					listViewNote.EnsureVisible(lvi.Index);
					listViewNote.Items[lvi.Index].Selected = true;
				}
			}
		}

		private void contextMenuStrip1_MouseEnter(object sender, EventArgs e)
		{
			if (listViewRun.SelectedItems.Count == 0 || listViewRun.SelectedItems[0].BackColor == Color.PaleGreen || listViewRun.SelectedItems[0].BackColor == Color.Orange || listViewRun.SelectedItems[0].BackColor == Color.Orchid )
			{
				goToolStripMenuItem.Enabled = false;
				return;
			}
			goToolStripMenuItem.Enabled = true;
			goToolStripMenuItem.DropDownItems.Clear();
			string[] s1 = SplitStr(listViewRun.SelectedItems[0].Text);
			string[] s2 = SplitStr(listViewRun.SelectedItems[0].SubItems[2].Text);
			ToolStripMenuItem[] tsi = new ToolStripMenuItem[s1.Length + s2.Length];
			string[] s3 = new string[tsi.Length];
			s1.CopyTo(s3, 0);
			s2.CopyTo(s3, s1.Length);
			if (null == s3 || s3.Length == 0)
			{
				goToolStripMenuItem.Enabled = false;
				return;
			}

			for (int i = 0; i < s3.Length; i++)
			{
				tsi[i] = new ToolStripMenuItem(s3[i].Trim());
				tsi[i].Click += new System.EventHandler(this.FindNote_Click);
			}

			goToolStripMenuItem.DropDownItems.AddRange(tsi);
		}

		private void contextMenuStrip2_MouseEnter(object sender, EventArgs e)
		{
			if (listViewNote.SelectedItems.Count == 0 || listViewNote.SelectedItems[0].BackColor == Color.PaleGreen )
			{
				goToDefinitionToolStripMenuItem.Enabled = false;
				return;
			}
			string [] s2 = null;
			goToDefinitionToolStripMenuItem.Enabled = true;
			goToDefinitionToolStripMenuItem.DropDownItems.Clear();
			if (listViewNote.SelectedItems.Count > 0) s2 = SplitStr(listViewNote.SelectedItems[0].SubItems[1].Text);

			ToolStripMenuItem[] tsi = new ToolStripMenuItem[s2.Length];

			if (null == s2 || s2.Length == 0)
			{
				goToDefinitionToolStripMenuItem.Enabled = false;
				return;
			}

			for (int i = 0; i < s2.Length; i++)
			{
				tsi[i] = new ToolStripMenuItem(s2[i].Trim());
				tsi[i].Click += new System.EventHandler(this.FindNote_Click);
			}

			goToDefinitionToolStripMenuItem.DropDownItems.AddRange(tsi);
		}

		private void helpToolStripMenuItem1_Click(object sender, EventArgs e)
		{
            System.Diagnostics.Process.Start(@"http://www.intervalles-systeme-g.com/");
		}

    }
}